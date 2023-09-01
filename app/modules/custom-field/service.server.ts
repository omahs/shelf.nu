import type { CustomField, Organization, Prisma, User } from "@prisma/client";
import { db } from "~/database";

export async function createCustomField({
  name,
  helpText,
  type,
  required,
  organizationId,
  userId,
}: Pick<CustomField, "helpText" | "name" | "type" | "required"> & {
  organizationId: Organization["id"];
  userId: User["id"];
}) {
  return db.customField.create({
    data: {
      name,
      helpText,
      type,
      required,
      organization: {
        connect: {
          id: organizationId,
        },
      },
      createdBy: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export async function getCustomFields({
  organizationId,
  page = 1,
  perPage = 8,
  search,
}: {
  organizationId: Organization["id"];

  /** Page number. Starts at 1 */
  page?: number;

  /** Items to be loaded per page */
  perPage?: number;

  search?: string | null;
}) {
  const skip = page > 1 ? (page - 1) * perPage : 0;
  const take = perPage >= 1 ? perPage : 8; // min 1 and max 25 per page

  /** Default value of where. Takes the items belonging to current user */
  let where: Prisma.CustomFieldWhereInput = { organizationId };

  /** If the search string exists, add it to the where object */
  if (search) {
    where.name = {
      contains: search,
      mode: "insensitive",
    };
  }

  const [customFields, totalCustomFields] = await db.$transaction([
    /** Get the items */
    db.customField.findMany({
      skip,
      take,
      where,
      orderBy: { updatedAt: "desc" },
    }),

    /** Count them */
    db.customField.count({ where }),
  ]);

  return { customFields, totalCustomFields };
}