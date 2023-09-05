import { Button } from "../shared";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../shared/hover-card";

export const ExportButton = ({
  canExportAssets,
}: {
  canExportAssets: boolean;
}) =>
  canExportAssets ? (
    <Button
      to={`export/assets-${new Date().toISOString().slice(0, 10)}.csv`}
      reloadDocument
      variant="secondary"
      role="link"
    >
      Export
    </Button>
  ) : (
    <HoverCard>
      <HoverCardTrigger className=" disabled inline-flex cursor-not-allowed items-center justify-center border-none p-0 text-text-sm font-semibold text-primary-700 hover:text-primary-800">
        Export
      </HoverCardTrigger>
      <HoverCardContent>
        <p>
          Exporting is not available on the free tier of shelf. Please{" "}
          <Button to="/settings/subscription" variant="secondary">
            upgrade to a paid plan
          </Button>
          .
        </p>
      </HoverCardContent>
    </HoverCard>
  );