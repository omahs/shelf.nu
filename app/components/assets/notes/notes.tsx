import { useLoaderData, useFetcher } from "@remix-run/react";
import { MarkdownViewer } from "~/components/markdown/markdown-viewer";
import { useUserData } from "~/hooks";
import type { loader } from "~/routes/_layout+/assets.$assetId";
import { isFormProcessing } from "~/utils";
import { NewNote } from "./new";
import type { NoteWithDate } from "./note";
import { Note } from "./note";

export const Notes = () => {
  const { asset } = useLoaderData<typeof loader>();
  /* Using user data here for the Note component generated for frontend only as per the optimistic UI approach */
  const user = useUserData();
  const hasNotes = asset?.notes.length > 0;
  /* Importing fetcher here in the parent file such that we can use fetcher's states to know the status of form processing and form data render the frontend component on the fly (Optimistic UI) and in the new note form this fetcher is passed as a prop */
  const fetcher = useFetcher();
  let onSubmissionContent = "";
  /* Getting the form data using fetcher and storing the content of form in onSubmissionContent Variable */
  if (fetcher.formData) {
    for (const data of fetcher.formData.entries()) {
      onSubmissionContent = data[1].toString();
    }
  }
  return (
    <div>
      <NewNote fetcher={fetcher} />
      {hasNotes ? (
        <ul className="notes-list mt-8 w-full">
          {isFormProcessing(fetcher.state) ? (
            <li className="note mb-6 rounded-lg border bg-white md:mb-8">
              <header className="flex justify-between border-b px-3.5 py-3 text-text-xs md:text-text-sm">
                <div>
                  <span className="commentator font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </span>{" "}
                  <span className="text-gray-600">Just Now</span>
                </div>
              </header>
              <div className="message px-3.5 py-3">
                <MarkdownViewer content={onSubmissionContent} />
              </div>
            </li>
          ) : null}
          {(asset.notes as NoteWithDate[]).map((note) => (
            <Note key={note.id} note={note} />
          ))}
        </ul>
      ) : (
        <div className="flex h-[500px] items-center  justify-center">
          <div className="flex flex-col items-center justify-center p-[16px] text-center md:p-[50px]">
            <img
              src="/images/no-notes.svg"
              alt="Graphic for no notes"
              className="mb-6 w-[172px]"
            />
            <h4>No Notes</h4>
            <p>
              Your asset `{asset.title}` has no notes <br />
              attached to it.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
