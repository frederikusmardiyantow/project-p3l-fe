/* eslint-disable react/prop-types */
import {
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import FormatDate from "../utils/FormatDate";
import Calendar from "react-calendar";
import { LuCalendarDays } from "react-icons/lu";

function InputDateComp({ label, value, setValue }) {

  return (
    <Popover placement="bottom">
      <PopoverTrigger>
        <Input
          radius="sm"
          startContent={<LuCalendarDays/>}
          color="primary"
          variant="bordered"
          label={label}
          value={FormatDate(value)}
          className="!text-start"
        />
      </PopoverTrigger>
      <PopoverContent className="bg-transparent shadow-none my-2">
        <div className="">
          <Calendar onChange={setValue} value={value} minDate={new Date()} maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}/>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default InputDateComp;
