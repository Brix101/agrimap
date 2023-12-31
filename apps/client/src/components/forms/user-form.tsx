import { Icons } from "@/components/icons";
import {
  AlertDialogCancel,
  AlertDialogFooter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QUERY_USERS_KEY } from "@/constant/query.constant";
import useRandomString from "@/hooks/useRandomString";
import { useToast } from "@/hooks/useToast";
import { useBoundStore } from "@/lib/store";
import { createUser, deleteUser, updateUser } from "@/services/user.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn, useForm } from "react-hook-form";
import { CreateUserInput, User, createUserBody, roleSchema } from "schema";

interface MutationProps {
  user: User;
}

export function AddUserForm() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { setDialogItem } = useBoundStore((state) => state.dialog);
  const { randString, getRandString } = useRandomString(8);

  const form = useForm<CreateUserInput>({
    resolver: zodResolver(createUserBody),
    defaultValues: {
      role: "USER",
      password: randString,
    },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: createUser,
    onSuccess: ({ data }) => {
      setDialogItem();
      toast({
        title: "Added",
        description: `User ${data.email} added successfully!`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries([QUERY_USERS_KEY]);
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  function onSubmit(data: CreateUserInput) {
    mutate(data);
  }

  return (
    <GenericForm
      form={form}
      isLoading={isLoading}
      onSubmit={onSubmit}
      getRandString={getRandString}
      buttonLabel="Add"
    />
  );
}

export function UpdateUserForm({ user }: MutationProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { setDialogItem } = useBoundStore((state) => state.dialog);
  const { getRandString } = useRandomString(8);

  const form = useForm<CreateUserInput>({
    resolver: zodResolver(createUserBody),
    defaultValues: {
      ...user,
      password: user.password as string,
    },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: updateUser,
    onSuccess: ({ data }) => {
      setDialogItem();
      toast({
        title: "Updated",
        description: `User ${data.email} updated successfully!`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries([QUERY_USERS_KEY]);
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  function onSubmit(data: CreateUserInput) {
    mutate({ id: user?._id as string, data });
  }

  return (
    <GenericForm
      form={form}
      isLoading={isLoading}
      onSubmit={onSubmit}
      getRandString={getRandString}
      buttonLabel="Update"
    />
  );
}

export function DeleteUserForm({ user }: MutationProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { setDialogItem } = useBoundStore((state) => state.dialog);

  const { mutate, isLoading } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.setQueriesData<User[]>([QUERY_USERS_KEY], (items) => {
        if (items) {
          return items.filter((item) => item._id !== user?._id);
        }
        return items;
      });
      setDialogItem();
      toast({
        title: "Deleted",
        description: `User ${user?._id} deleted successfully!`,
      });
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  function handleDeleteClick() {
    mutate(user?._id ?? "");
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
      <AlertDialogCancel type="button" disabled={isLoading}>
        Cancel
      </AlertDialogCancel>
    </AlertDialogFooter>
  );
}

function GenericForm({
  form,
  isLoading,
  onSubmit,
  getRandString,
  buttonLabel,
}: {
  form: UseFormReturn<CreateUserInput, unknown, undefined>;
  isLoading: boolean;
  onSubmit(data: CreateUserInput): void;
  getRandString: () => string;
  buttonLabel: "Add" | "Update";
}) {
  const roles = Object.values(roleSchema.Values);

  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormField
          control={form.control}
          name="firstname"
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
          name="lastname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lastname</FormLabel>
              <FormControl>
                <Input placeholder="lastname" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <Input placeholder="password" {...field} />
                    <Button
                      size={"icon"}
                      type="button"
                      onClick={() => {
                        const newSTring = getRandString();
                        field.onChange(newSTring);
                      }}
                    >
                      <Icons.dices />
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {roles.map((value, index) => (
                    <SelectItem key={index} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <AlertDialogFooter>
          <AlertDialogCancel type="button" disabled={isLoading}>
            Cancel
          </AlertDialogCancel>
          <Button disabled={isLoading}>
            {isLoading ? (
              <Icons.spinner
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            ) : (
              <Icons.plus className="mr-2 h-4 w-4" aria-hidden="true" />
            )}
            {buttonLabel}
            <span className="sr-only">{buttonLabel}</span>
          </Button>
        </AlertDialogFooter>
      </form>
    </Form>
  );
}
