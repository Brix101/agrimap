import { Icons } from "@/components/icons";
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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { QUERY_FARMS_KEY } from "@/constant/query.constant";
import { useBoundStore } from "@/lib/store";
import { createFarmSchema } from "@/lib/validations/farm";
import { createFarm, deleteFarm, updateFarm } from "@/services/farm.service";
import { useGetAuth } from "@/services/session.service";
import { DialogHeaderDetail, Mode } from "@/types";
import { CreateFarmInput, Farm } from "@/types/farm.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export function FarmDialog() {
  const { user } = useGetAuth();
  const { mode } = useBoundStore((state) => state.farm);
  const isOpen = mode !== "view";

  const modeToTitle: Record<Mode, DialogHeaderDetail> = {
    view: {
      title: "View Farm",
      description: "View farm details.",
    },
    create: {
      title: "Add Farm",
      description: "add a new farm.",
      form: <CreateForm token={user?.accessToken ?? ""} />,
    },
    update: {
      title: "Update Farm",
      description: "Update farm information.",
      form: <UpdateForm token={user?.accessToken ?? ""} />,
    },
    delete: {
      title: "Are you absolutely sure?",
      description: "Delete farm data (cannot be undone).",
      form: <DeleteForm token={user?.accessToken ?? ""} />,
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

function CreateForm({ token }: { token: string }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { setMode } = useBoundStore((state) => state.farm);

  const form = useForm<CreateFarmInput>({
    resolver: zodResolver(createFarmSchema),
    defaultValues: { ownerId: "", hectar: 0, proof: "", coordinates: [] },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: createFarm,
    onSuccess: ({ data }) => {
      queryClient.setQueriesData([QUERY_FARMS_KEY], (prev: unknown) => {
        const categories = prev as Farm[];
        return [data, ...categories];
      });

      handleCancelClick();
      toast({
        title: "Created",
        description: `Farm ${data._id} created successfully!`,
      });
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  function onSubmit(data: CreateFarmInput) {
    mutate({ token, data });
  }

  function handleCancelClick() {
    setMode({ mode: "view" });
    form.reset();
  }

  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormField
          control={form.control}
          name="ownerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Firstname</FormLabel>
              <FormControl>
                <Input placeholder="firstname" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hectar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lastname</FormLabel>
              <FormControl>
                <Input type="number" placeholder="lastname" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="proof"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="address" {...field} />
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
            ) : (
              <Icons.plus className="mr-2 h-4 w-4" aria-hidden="true" />
            )}
            Add
            <span className="sr-only">Add</span>
          </Button>
        </AlertDialogFooter>
      </form>
    </Form>
  );
}

function UpdateForm({ token }: { token: string }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { setMode, farm } = useBoundStore((state) => state.farm);

  const form = useForm<CreateFarmInput>({
    resolver: zodResolver(createFarmSchema),
    defaultValues: { ownerId: "", hectar: 0, proof: "", coordinates: [] },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: updateFarm,
    onSuccess: ({ data }) => {
      console.log(data);
      queryClient.setQueriesData<Farm[]>([QUERY_FARMS_KEY], (prev) => {
        const farms = prev as Farm[];
        return farms.map((item) => {
          if (item.id === data.id) {
            return data;
          }
          return item;
        });
      });
      handleCancelClick();
      toast({
        title: "Updated",
        description: `Farm ${data._id} updated successfully!`,
      });
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  function onSubmit(data: CreateFarmInput) {
    mutate({ token, id: farm?._id as string, data });
  }

  function handleCancelClick() {
    setMode({ mode: "view" });
    form.reset();
  }

  useEffect(() => {
    if (farm) {
      form.reset({
        ...farm,
      });
    }
  }, [farm, form]);

  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormField
          control={form.control}
          name="ownerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Firstname</FormLabel>
              <FormControl>
                <Input placeholder="firstname" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hectar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lastname</FormLabel>
              <FormControl>
                <Input type="number" placeholder="lastname" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="proof"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />{" "}
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
            ) : (
              <Icons.penLine className="mr-2 h-4 w-4" aria-hidden="true" />
            )}
            Update
            <span className="sr-only">Add</span>
          </Button>
        </AlertDialogFooter>
      </form>
    </Form>
  );
}

function DeleteForm({ token }: { token: string }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { farm, setMode } = useBoundStore((state) => state.farm);

  const { mutate, isLoading } = useMutation({
    mutationFn: deleteFarm,
    onSuccess: () => {
      queryClient.setQueriesData<Farm[]>([QUERY_FARMS_KEY], (prev) => {
        const farms = prev as Farm[];
        return farms.filter((item) => item.id !== farm?._id);
      });

      handleCancelClick();
      toast({
        title: "Deleted",
        description: `Farm ${farm?._id} deleted successfully!`,
      });
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  function handleDeleteClick() {
    mutate({ token, id: farm?._id ?? "" });
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
