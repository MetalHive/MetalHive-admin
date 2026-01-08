
export {};
export type DropdownOption = {
  label: string;
  value: string;
};

export type DropdownConfig = {
  name: string;
  options: DropdownOption[];
  label?: string; // <-- this is the label above the dropdown
};

export type ModalConfigItem = {
  header: string;
  subtext?: string;
  confirmText?: string;
  confirmVariant?: "primary" | "danger" | "warning";
  dropdowns?: DropdownConfig[];
  api: string;
  successHeader?: string;
  successSubtext?: string;
};


export const MODAL_CONFIG: Record<string, ModalConfigItem> = {

   SUSPEND_SUBSCRIPTION: {
    header: "Cancel User Subscription",
    subtext:
      "This action will cancel the user’s active subscription and remove their ability to place new bids on the platform.The user will retain access until the end of the current billing period.",
    confirmText: "Suspend",
    confirmVariant: "danger",
    api: "/api/suspend-listing",
    dropdowns: [
      {
        label: "Reason",
        name: "reason",
        options: [
          { label: "Incomplete Docs", value: "incomplete" },
          { label: "Invalid Info", value: "invalid" },
        ],
      },
      {
        label: "Duration (optional)",
        name: "duration",
        options: [
          { label: "7 Days", value: "7_days" },
          { label: "14 Days", value: "14_days" },
          { label: "30 Days", value: "30_days" },
        ],
      },
    ],
    successHeader: "Subscription Cancelled",
    successSubtext:
      "The user’s subscription has been cancelled successfully.They will no longer be able to place new bids once the current billing period ends.",
  },

    REINSTATE_ACCOUNT: {
    header: "Reinstate Account",
    subtext: "Reinstating this account will restore the user’s access to the platform and re-enable all permitted actions.",
    confirmText: "OK",
    confirmVariant: "primary",
    api: "/api/simple-action",
    successHeader: "Account Reinstated Successfully",
    successSubtext: "Account successfully reinstated. Other users  can now interact with it.",
  },
  REINSTATE_LISTING: {
    header: "Reinstate Listing",
    subtext: "Reinstating this listing will make it visible to buyers again.",
    confirmText: "OK",
    confirmVariant: "primary",
    api: "/api/simple-action",
    successHeader: "Action successful",
    successSubtext: "Your action was completed successfully.",
  },

  SUSPEND_LISTING: {
    header: "Suspend Listing",
    subtext:
      "Suspending this listing will temporarily remove it from the marketplace. Buyers will no longer be able to place bids.",
    confirmText: "Suspend",
    confirmVariant: "danger",
    api: "/api/suspend-listing",
    dropdowns: [
      {
        label: "Reason",
        name: "reason",
        options: [
          { label: "Incomplete Docs", value: "incomplete" },
          { label: "Invalid Info", value: "invalid" },
        ],
      },
      {
        label: "Duration (optional)",
        name: "duration",
        options: [
          { label: "7 Days", value: "7_days" },
          { label: "14 Days", value: "14_days" },
          { label: "30 Days", value: "30_days" },
        ],
      },
    ],
    successHeader: "Listing Suspended",
    successSubtext:
      "Listing successfully suspended. The listing will no longer be available for bids until reinstated.",
  },

  SUSPEND_ACCOUNT: {
    header: "Suspend Account",
    subtext:
      "Suspending this account will temporarily block the user from accessing the platform.",
    confirmText: "Suspend",
    confirmVariant: "danger",
    api: "/api/suspend-account",
    dropdowns: [
      {
        label: "Duration",
        name: "duration",
        options: [
          { label: "Until manually lifted", value: "manual" },
          { label: "7 Days", value: "7_days" },
          { label: "14 Days", value: "14_days" },
        ],
      },
      {
        label: "Reason (optional)",
        name: "reason",
        options: [
          { label: "Doesn't dance", value: "dancer" },
          { label: "Doesn't sing", value: "singer" },
          { label: "Doesn't clap", value: "clapper" },
        ],
      },
    ],
    successHeader: "Account Suspended",
    successSubtext:
      "The account has been suspended successfully.",
  },
 REJECT_BUY: {
    header: "Delete Account",
    subtext:
      "Deleting this account will permanently remove the user and all associated data.",
    confirmText: "Delete",
    confirmVariant: "danger",
    api: "/api/delete-account",
    dropdowns: [
      {
        label: "Reason",
        name: "reason",
        options: [
          { label: "Incomplete Docs", value: "incomplete" },
          { label: "Invalid Info", value: "invalid" },
        ],
      },
    ],
    successHeader: "Account Deleted",
    successSubtext: "The account has been permanently removed.",
  },

  DELETE_ACCOUNT: {
    header: "Delete Account",
    subtext:
      "Deleting this account will permanently remove the user and all associated data.",
    confirmText: "Delete",
    confirmVariant: "danger",
    api: "/api/delete-account",
    dropdowns: [
      {
        label: "Reason",
        name: "reason",
        options: [
          { label: "Incomplete Docs", value: "incomplete" },
          { label: "Invalid Info", value: "invalid" },
        ],
      },
    ],
    successHeader: "Account Deleted",
    successSubtext: "The account has been permanently removed.",
  },

  DELETE_LISTING: {
    header: "Delete Listing",
    subtext:
      "Deleting this listing will permanently remove it from the marketplace.",
    confirmText: "Delete",
    confirmVariant: "danger",
    api: "/api/delete-listing",
    dropdowns: [
      {
        label: "Reason",
        name: "reason",
        options: [
          { label: "Incomplete Docs", value: "incomplete" },
          { label: "Invalid Info", value: "invalid" },
        ],
      },
    ],
    successHeader: "Listing Deleted",
    successSubtext: "The listing has been removed from the system.",
  },

  REJECT_VERIFICATION: {
    header: "Reject Verification",
    subtext: "Select a reason for rejection.",
    confirmText: "Reject",
    confirmVariant: "warning",
    api: "/api/reject-verification",
    dropdowns: [
      {
        label: "Reason",
        name: "reason",
        options: [
          { label: "Incomplete Docs", value: "incomplete" },
          { label: "Invalid Info", value: "invalid" },
        ],
      },
    ],
    successHeader: "Verification Rejected",
    successSubtext: "Reason: {{reason}} has been recorded.",
  },

  SIMPLE_CONFIRM: {
    header: "Confirm Action",
    confirmText: "OK",
    confirmVariant: "primary",
    api: "/api/simple-action",
    successHeader: "Action successful",
    successSubtext: "Your action was completed successfully.",
  },
};
