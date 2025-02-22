import type { Location } from "@prisma/client";
import { Form, useNavigation } from "@remix-run/react";
import { useAtom, useAtomValue } from "jotai";
import { useZorm } from "react-zorm";
import { z } from "zod";
import { fileErrorAtom, validateFileAtom } from "~/atoms/file";
import { updateTitleAtom } from "~/atoms/locations.new";
import { isFormProcessing } from "~/utils";
import { zodFieldIsRequired } from "~/utils/zod";
import FormRow from "../forms/form-row";
import Input from "../forms/input";
import { Button } from "../shared";
import { Spinner } from "../shared/spinner";

export const NewLocationFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string(),
  address: z.string(),
});

/** Pass props of the values to be used as default for the form fields */
interface Props {
  name?: Location["name"];
  address?: Location["address"];
  description?: Location["description"];
}

export const LocationForm = ({ name, address, description }: Props) => {
  const navigation = useNavigation();
  const zo = useZorm("NewQuestionWizardScreen", NewLocationFormSchema);
  const disabled = isFormProcessing(navigation.state);

  const fileError = useAtomValue(fileErrorAtom);
  const [, validateFile] = useAtom(validateFileAtom);
  const [, updateName] = useAtom(updateTitleAtom);

  return (
    <Form
      ref={zo.ref}
      method="post"
      className="flex w-full flex-col gap-2"
      encType="multipart/form-data"
    >
      <FormRow
        rowLabel={"Name"}
        className="border-b-0 pb-[10px]"
        required={zodFieldIsRequired(NewLocationFormSchema.shape.name)}
      >
        <Input
          label="Name"
          hideLabel
          name={zo.fields.name()}
          disabled={disabled}
          error={zo.errors.name()?.message}
          autoFocus
          onChange={updateName}
          className="w-full"
          defaultValue={name || undefined}
          placeholder="Storage room"
          required={zodFieldIsRequired(NewLocationFormSchema.shape.name)}
        />
      </FormRow>

      <FormRow rowLabel={"Main image"}>
        <div>
          <p className="hidden lg:block">Accepts PNG, JPG or JPEG (max.4 MB)</p>
          <Input
            // disabled={disabled}
            accept="image/png,.png,image/jpeg,.jpg,.jpeg"
            name="image"
            type="file"
            onChange={validateFile}
            label={"Main image"}
            hideLabel
            error={fileError}
            className="mt-2"
            inputClassName="border-0 shadow-none p-0 rounded-none"
          />
          <p className="mt-2 lg:hidden">Accepts PNG, JPG or JPEG (max.4 MB)</p>
        </div>
      </FormRow>

      <FormRow
        rowLabel={"Address"}
        subHeading={
          <p>
            Will set location’s geo position to address. Make sure to add an
            accurate address, to ensure the map location is as accurate as
            possible
          </p>
        }
        className="pt-[10px]"
        required={zodFieldIsRequired(NewLocationFormSchema.shape.address)}
      >
        <Input
          label="Address"
          hideLabel
          name={zo.fields.address()}
          disabled={disabled}
          error={zo.errors.address()?.message}
          className="w-full"
          defaultValue={address || undefined}
          required={zodFieldIsRequired(NewLocationFormSchema.shape.address)}
        />
      </FormRow>

      <div>
        <FormRow
          rowLabel="Description"
          subHeading={
            <p>
              This is the initial object description. It will be shown on the
              location page. You can always change it.
            </p>
          }
          required={zodFieldIsRequired(NewLocationFormSchema.shape.description)}
        >
          <Input
            inputType="textarea"
            label={zo.fields.description()}
            name={zo.fields.description()}
            defaultValue={description || ""}
            placeholder="Add a description for your location."
            disabled={disabled}
            data-test-id="locationDescription"
            className="w-full"
            required={zodFieldIsRequired(
              NewLocationFormSchema.shape.description
            )}
          />
        </FormRow>
      </div>

      <div className="text-right">
        <Button type="submit" disabled={disabled}>
          {disabled ? <Spinner /> : "Save"}
        </Button>
      </div>
    </Form>
  );
};
