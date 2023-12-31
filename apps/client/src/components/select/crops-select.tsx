import { Badge } from "@/components/ui/badge";
import { QUERY_CROPS_KEY } from "@/constant/query.constant";
import { useGetFarmCrops } from "@/services/farm.service";
import { useQueryClient } from "@tanstack/react-query";
import { ActionMeta, MultiValue } from "react-select";
import AsyncCreatableSelect from "react-select/async-creatable";

interface CropOption {
  value: string;
  label: string;
}

interface Props {
  isDisabled?: boolean;
  value: string[];
  onChange: (
    newValue: MultiValue<CropOption>,
    actionMeta: ActionMeta<CropOption>,
  ) => void;
  onCreateOption: (inputValue: string) => void;
}

export function CropSelect({
  isDisabled,
  value,
  onChange,
  onCreateOption,
}: Props) {
  const queryClient = useQueryClient();
  const { data, isLoading } = useGetFarmCrops();

  const cropOptions: CropOption[] =
    data?.map((crop) => ({ value: crop, label: crop })) ?? [];

  const filterColors = (inputValue: string) => {
    return cropOptions.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase()),
    );
  };

  const promiseOptions = (inputValue: string) =>
    new Promise<CropOption[]>((resolve) => {
      setTimeout(() => {
        resolve(filterColors(inputValue));
      }, 500);
    });

  const selectedOptions = cropOptions.filter((item) =>
    value.includes(item.value),
  );

  function handleCreateOption(inputValue: string) {
    queryClient.setQueriesData<string[]>([QUERY_CROPS_KEY], (items) => {
      if (items) {
        return [...items, inputValue].sort();
      }
      return items;
    });
    onCreateOption(inputValue);
  }

  if (isDisabled) {
    return (
      <div className="flex flex-wrap gap-2 border p-2 rounded-md min-h-[40px]">
        {selectedOptions.map((item, index) => (
          <Badge
            variant="secondary"
            key={index}
            className="cursor-default capitalize"
          >
            {item.label}
          </Badge>
        ))}
      </div>
    );
  }

  return (
    <AsyncCreatableSelect
      isMulti
      isClearable={false}
      isLoading={isLoading}
      defaultOptions={cropOptions}
      loadOptions={promiseOptions}
      placeholder="Select crops..."
      value={selectedOptions}
      onChange={onChange}
      onCreateOption={handleCreateOption}
      className="capitalize"
    />
  );
}
