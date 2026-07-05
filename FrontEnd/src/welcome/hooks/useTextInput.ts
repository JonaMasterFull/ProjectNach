import { useState } from "react";

export const useTextInput = (value: string, onChange: (value: string) => void) => {
    const [isTouched, setIsTouched] = useState(false);

  const isEmpty = value.length === 0;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  }

  const handleFocus = () => {
    if (isTouched) return;
    setIsTouched(true);
  }

  const handleBlur = () => {
    if (isTouched) return;
    setIsTouched(true);
  }
  return {
    isTouched,
    isEmpty,
    handleChange,
    handleFocus,
    handleBlur,
  }
}
