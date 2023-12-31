import { Icons } from "@/components/icons";
import {
  BarangaySelect,
  CitySelect,
  ProvinceSelect,
} from "@/components/select/address-select";
import { CropSelect } from "@/components/select/crops-select";
import {
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  QUERY_FARMERS_KEY,
  QUERY_FARMS_KEY,
  QUERY_MORTGAGES_KEY,
} from "@/constant/query.constant";
import { useToast } from "@/hooks/useToast";
import { useBoundStore } from "@/lib/store";
import { UploadButton } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { archivedFarm } from "@/services/farm.service";
import { useGetFarmers } from "@/services/farmer.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { CreateFarmInput, Farm, farmSchema } from "schema";

interface MutationProps {
  farm: Farm;
}

export function ArchivedFarmForm({ farm }: MutationProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { setDialogItem } = useBoundStore((state) => state.dialog);

  const { mutate, isLoading } = useMutation({
    mutationFn: archivedFarm,
    onSuccess: ({ data }) => {
      const updateFarm = farmSchema.parse(data);
      queryClient.invalidateQueries([QUERY_FARMERS_KEY]);
      queryClient.refetchQueries([QUERY_MORTGAGES_KEY]);
      queryClient.setQueriesData<Farm[]>([QUERY_FARMS_KEY], (items) => {
        if (items) {
          return items.map((item) => {
            if (item._id === updateFarm._id) {
              return { ...updateFarm, isMortgage: item.isMortgage };
            }
            return item;
          });
        }
        return items;
      });
      setDialogItem();
      toast({
        title: farm?.isArchived ? "Unarchived" : "Archived",
        description: `Farm ${farm?._id} ${
          farm?.isArchived ? "unarchived" : "archived"
        } successfully!`,
      });
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  function handleDeleteClick() {
    mutate(farm?._id ?? "");
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

export function FarmGenericForm({
  form,
  isEditMode,
}: {
  form: UseFormReturn<CreateFarmInput, unknown, undefined>;
  isEditMode: boolean;
}) {
  const [open, setOpen] = useState(false);

  const { data, isLoading: isFarmerLoading } = useGetFarmers({});

  const selectedFarmer = data?.find(
    (item) => item._id === form.getValues("ownerId")
  );

  return (
    <ScrollArea className="h-[80vh] col-span-2 pr-2">
      <Form {...form}>
        <form className="grid gap-4 px-2">
          <FormField
            control={form.control}
            name="coordinates"
            render={() => (
              <FormItem>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ownerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Owner</FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger
                    asChild
                    disabled={isFarmerLoading || !isEditMode}
                  >
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-label="Load a preset..."
                      aria-expanded={open}
                      className="flex-1 justify-between w-full disabled:opacity-100"
                    >
                      {isFarmerLoading ? (
                        "Loading ..."
                      ) : (
                        <>
                          {field.value ? (
                            <>
                              {selectedFarmer?.lastname +
                                ", " +
                                selectedFarmer?.firstname}
                            </>
                          ) : (
                            "Select farmer..."
                          )}
                        </>
                      )}
                      <Icons.chevronsUpDown
                        className={cn(
                          "ml-2 h-4 w-4 shrink-0 opacity-50",
                          isEditMode ? "visible" : "hidden"
                        )}
                      />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search farmers..." />
                      <CommandEmpty>No farmers found.</CommandEmpty>
                      <CommandGroup heading="Farmers">
                        {data?.map((item) => (
                          <CommandItem
                            key={item._id}
                            onSelect={() => {
                              field.onChange(item._id);
                              setOpen(false);
                            }}
                            className="capitalize"
                          >
                            {item.lastname + ", " + item.firstname}
                            <Icons.check
                              className={cn(
                                "ml-auto h-4 w-4",
                                field.value === item._id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="size"
            disabled={!isEditMode}
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
            name="titleNumber"
            disabled={!isEditMode}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title Number</FormLabel>
                <FormControl>
                  <Input
                    className="disabled:opacity-100"
                    placeholder="title number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="crops"
            render={({ field: { value, onChange } }) => (
              <FormItem>
                <FormLabel>Crops</FormLabel>
                <FormControl>
                  <CropSelect
                    value={value}
                    onChange={(e) => onChange(e.map((item) => item.value))}
                    onCreateOption={(e) => onChange([...value, e])}
                    isDisabled={!isEditMode}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address.streetAddress"
            disabled={!isEditMode}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purok/Sitio</FormLabel>
                <FormControl>
                  <Input
                    className="disabled:opacity-100"
                    placeholder="purok/sitio"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="address.cityOrProvince"
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel>Province</FormLabel>
                    <ProvinceSelect
                      isDisabled={!isEditMode}
                      value={value != "" ? { label: value } : undefined}
                      onChange={(e) => onChange(e?.label)}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="address.municipality"
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel>City/Municipality</FormLabel>
                    <CitySelect
                      isDisabled={!isEditMode}
                      value={value != "" ? { label: value } : undefined}
                      onChange={(e) => onChange(e?.label)}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="address.barangay"
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel>Barangay</FormLabel>
                    <BarangaySelect
                      isDisabled={!isEditMode}
                      value={value != "" ? { label: value } : undefined}
                      onChange={(e) => onChange(e?.label)}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                disabled={!isEditMode}
                name="address.zipcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zipcode</FormLabel>
                    <FormControl>
                      <Input
                        className="disabled:opacity-100"
                        placeholder="zipcode"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <FormField
            control={form.control}
            name="proofFiles"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Document(s)</FormLabel>
                <FormControl>
                  <div className="flex flex-col gap-5">
                    <div className={cn(isEditMode ? "visible" : "hidden")}>
                      <UploadButton
                        endpoint="proofFiles"
                        className="ut-label:text-lg ut-allowed-content:ut-uploading:text-red-300 ut-button:bg-primary ut-button:text-primary-foreground ut-button:hover:bg-primary/90 ut-button:w-full"
                        onClientUploadComplete={(res) => {
                          if (res) {
                            field.onChange([...field.value, ...res]);
                          }
                        }}
                        onUploadError={(error: Error) => {
                          console.log(error);
                          form.setError("proofFiles", {
                            message: "Please select a valid file!",
                          });
                        }}
                      />
                    </div>
                    <FormMessage />
                    <Separator />
                    <div className="flex flex-col gap-2">
                      {field.value.map((item) => (
                        <div
                          key={item.fileKey}
                          className="flex gap-2 items-center hover:bg-slate-50 rounded-lg"
                        >
                          <a
                            href={item.fileUrl}
                            target="_blank"
                            className={cn(
                              buttonVariants({
                                size: "sm",
                                variant: "link",
                              }),
                              "w-full justify-start"
                            )}
                          >
                            {item.fileName}
                          </a>
                          <Button
                            className={cn(isEditMode ? "visible" : "hidden")}
                            type="button"
                            size={"icon"}
                            variant={"ghost"}
                            onClick={() => {
                              field.onChange(
                                field.value.filter(
                                  (file) => file.fileKey !== item.fileKey
                                )
                              );
                            }}
                          >
                            <Icons.trash
                              className="h-4 w-4"
                              aria-hidden="true"
                            />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </ScrollArea>
  );
}
