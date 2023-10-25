/* eslint-disable react/prop-types */
import {
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import FormatDate from "../utils/FormatDate";
import { useState } from "react";
import Calendar from "react-calendar";

function InputDateComp({ label }) {
  const [value, setValue] = useState(new Date());

  return (
    <Popover placement="bottom">
      <PopoverTrigger>
        <Input
          type="text"
          variant="bordered"
          label={label}
          value={FormatDate(value)}
          className="bg-white rounded-xl text-lg"
        />
      </PopoverTrigger>
      <PopoverContent>
        <div className="w-50">
          <Calendar onChange={setValue} value={value} minDate={new Date()} maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}/>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default InputDateComp;
