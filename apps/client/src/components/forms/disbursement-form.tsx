import { Icons } from "@/components/icons";
import { AssistanceSelect } from "@/components/select/assistances-select";
import DateSelect from "@/components/select/date-select";
import { FarmerSelect } from "@/components/select/farmer-select";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { QUERY_DISBURSEMENTS_KEY } from "@/constant/query.constant";
import { useBoundStore } from "@/lib/store";
import {
  createDisbursement,
  deleteDisbursement,
  updateDisbursement,
} from "@/services/disbursement.service";
import { DialogHeaderDetail, Mode } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { UseFormReturn, useForm } from "react-hook-form";
import {
  CreateDisbursementInput,
  Disbursement,
  createDisbursementBody,
} from "schema";
import { Input } from "../ui/input";

export function DisbursementDialog() {
  const { mode } = useBoundStore((state) => state.disbursement);
  const isOpen = mode !== "view";

  const modeToTitle: Record<Mode, DialogHeaderDetail> = {
    view: {
      title: "View Disbursement",
      description: "View disbursement details.",
    },
    create: {
      title: "Add Data",
      description: "add a disbursement data.",
      form: <CreateForm />,
    },
    update: {
      title: "Update Data",
      description: "update a disbursement data.",
      form: <UpdateForm />,
    },
    delete: {
      title: "Are you absolutely sure?",
      description: "Delete disbursement data (cannot be undone).",
      form: <DeleteForm />,
    },
  };

  const { title, description, form } = modeToTitle[mode];

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description} </AlertDialogDescription>
        </AlertDialogHeader>
        <Separator />
        <div>{form}</div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function CreateForm() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { setMode } = useBoundStore((state) => state.disbursement);

  const form = useForm<CreateDisbursementInput>({
    resolver: zodResolver(createDisbursementBody),
    defaultValues: {
      farmer: "",
      assistances: [],
      size: 0,
      receivedDate: new Date().toString(),
    },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: createDisbursement,
    onSuccess: ({ data }) => {
      handleCancelClick();
      toast({
        title: "Created",
        description: `Disbursement ${data._id} created successfully!`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries([QUERY_DISBURSEMENTS_KEY]);
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  function onSubmit(data: CreateDisbursementInput) {
    mutate(data);
  }

  function handleCancelClick() {
    setMode({ mode: "view" });
    form.reset();
  }

  return (
    <DisbursementGenericForm
      form={form}
      handleCancelClick={handleCancelClick}
      isLoading={isLoading}
      onSubmit={onSubmit}
      buttonLabel="Add"
    />
  );
}

function UpdateForm() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { setMode, disbursement } = useBoundStore(
    (state) => state.disbursement
  );

  const form = useForm<CreateDisbursementInput>({
    resolver: zodResolver(createDisbursementBody),
    defaultValues: {
      assistances: [],
      size: 0,
      farmer: "",
      receivedDate: new Date().toString(),
    },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: updateDisbursement,
    onSuccess: ({ data }) => {
      handleCancelClick();
      toast({
        title: "Updated",
        description: `Disbursement ${data._id} updated successfully!`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries([QUERY_DISBURSEMENTS_KEY]);
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  function onSubmit(data: CreateDisbursementInput) {
    mutate({ id: disbursement?._id as string, data });
  }

  function handleCancelClick() {
    setMode({ mode: "view" });
    form.reset();
  }

  useEffect(() => {
    if (disbursement) {
      form.reset({
        ...disbursement,
        farmer: disbursement.farmer._id,
      });
    }
  }, [disbursement, form]);

  return (
    <DisbursementGenericForm
      form={form}
      handleCancelClick={handleCancelClick}
      isLoading={isLoading}
      onSubmit={onSubmit}
      buttonLabel="Update"
    />
  );
}

function DeleteForm() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { disbursement, setMode } = useBoundStore(
    (state) => state.disbursement
  );

  const { mutate, isLoading } = useMutation({
    mutationFn: deleteDisbursement,
    onSuccess: () => {
      queryClient.setQueriesData<Disbursement[]>(
        [QUERY_DISBURSEMENTS_KEY],
        (prev) => {
          if (prev) {
            return prev.filter((item) => item._id !== disbursement?._id);
          }
          return prev;
        }
      );

      handleCancelClick();
      toast({
        title: "Deleted",
        description: `Disbursement ${disbursement?._id} deleted successfully!`,
      });
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  function handleDeleteClick() {
    mutate(disbursement?._id ?? "");
  }

  function handleCancelClick() {
    setMode({ mode: "view" });
  }
  return (
    <AlertDialogFooter>
      <Button
        variant={"destructive"}
        disabled={isLoading}
        onClick={handleDeleteClick}
      >
        {isLoading && (
          <Icons.spinner
            className="mr-2 h-4 w-4 animate-spin"
            aria-hidden="true"
          />
        )}
        Continue
      </Button>

      <AlertDialogCancel disabled={isLoading} onClick={handleCancelClick}>
        Cancel
      </AlertDialogCancel>
    </AlertDialogFooter>
  );
}

function DisbursementGenericForm({
  form,
  isLoading,
  onSubmit,
  handleCancelClick,
  buttonLabel,
}: {
  form: UseFormReturn<CreateDisbursementInput, any, undefined>;
  isLoading: boolean;
  onSubmit(data: CreateDisbursementInput): void;
  handleCancelClick(): void;
  buttonLabel: "Add" | "Update";
}) {
  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormField
          control={form.control}
          name="farmer"
          render={({ field: { value, onChange } }) => (
            <FormItem>
              <FormLabel>Farmer</FormLabel>
              <FormControl>
                <FarmerSelect
                  value={value}
                  onChange={(e) => onChange(e?.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="size"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Size (square meter)</FormLabel>
              <FormControl>
                <Input
                  className="disabled:opacity-100"
                  type="number"
                  placeholder="size"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="assistances"
          render={({ field: { value, onChange } }) => (
            <FormItem>
              <FormLabel>Assistances</FormLabel>
              <FormControl>
                <AssistanceSelect
                  value={value}
                  onChange={(e) => onChange(e.map((item) => item.value))}
                  onCreateOption={(e) => onChange([...value, e])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="receivedDate"
          render={({ field: { value, onChange } }) => (
            <FormItem>
              <FormLabel>Received Date</FormLabel>
              <FormControl>
                <DateSelect value={value} onChange={(e) => onChange(e)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <AlertDialogFooter>
          <Button
            type="button"
            disabled={isLoading}
            variant={"outline"}
            onClick={handleCancelClick}
          >
            Cancel
          </Button>
          <Button disabled={isLoading}>
            {isLoading ? (
              <Icons.spinner
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            ) : buttonLabel === "Add" ? (
              <Icons.plus className="mr-2 h-4 w-4" aria-hidden="true" />
            ) : (
              <Icons.penLine className="mr-2 h-4 w-4" aria-hidden="true" />
            )}
            {buttonLabel}
            <span className="sr-only">{buttonLabel}</span>
          </Button>
        </AlertDialogFooter>
      </form>
    </Form>
  );
}