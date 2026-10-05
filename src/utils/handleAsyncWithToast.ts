/* eslint-disable @typescript-eslint/no-explicit-any */

import { toast } from "sonner";

// Now handleAsyncWithToast accepts dispatch as an argument
export const handleAsyncWithToast = async (
  asyncCallback: () => Promise<any>,
  loadingMessage: string,
  successMessage?: string,
  errorMessage?: string,
) => {
  const toastInit = toast.loading(loadingMessage);

  try {
    const res = await asyncCallback();
    const successData = res?.data?.success;
    const successMessageFromResponse = res?.data?.message || successMessage;
    

    if (successData) {
      toast.success(successMessageFromResponse, {
        id: toastInit,
      });
    }

    if (res?.message) {
      toast.success(res.message, {
        id: toastInit,
      });
    }

    if (!successData) {
      toast.error(res?.error?.data?.errorSources?.[0]?.message || errorMessage, {
        id: toastInit,
      });
    }

    return res; // Return response if needed
  } catch (error) {
    toast.error(
      (error as any)?.errorSources?.[0]?.message ||
        errorMessage ||
        "Something went wrong",
      {
        id: toastInit,
      }
    );
    throw error; // Rethrow error if further handling is needed
  } finally {
    // Delay for 2 seconds before dismissing the toast
    setTimeout(() => {
      toast.dismiss(toastInit);
    }, 3500);
  }
};
