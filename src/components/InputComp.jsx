import { GrCircleAlert } from "react-icons/gr";

/* eslint-disable react/prop-types */
export default function InputComp({
  type = "text",
  id,
  name,
  placeholder,
  autoComplete = "on",
  value,
  validation,
  onChange,
  className,
  children,
}) {
  return (
    <div>
    <div className={`flex items-center flex-wrap md:flex-nowrap gap-4 relative ${className}`}>
      {children}
      <div className={`relative w-full inline-flex tap-highlight-transparent shadow-sm px-3 bg-[rgba(255,255,255,.8)] hover:bg-default-200 min-h-unit-10 rounded-medium flex-col items-start justify-center gap-0 transition-background motion-reduce:transition-none !duration-150 h-14 py-2 ps-14 ring-2 ${validation && 'ring-red-600 bg-red-200 hover:bg-red-300'}`}>
        <label htmlFor={id} className="block font-medium text-foreground-600 text-tiny cursor-text will-change-auto origin-top-left transition-all !duration-200 !ease-out motion-reduce:transition-none w-full">{name}</label>
        <input
          className={`w-full h-full font-normal !bg-transparent outline-none placeholder:text-foreground-500 text-small`}
          type={type}
          id={id}
          label={name}
          placeholder={placeholder}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
        />
      </div>
      {validation && <GrCircleAlert className="text-white absolute end-5" color="#fff"/>}
    </div>
    <p className="text-red-500 text-sm mt-1">{validation}</p>
    </div>
  );
}
