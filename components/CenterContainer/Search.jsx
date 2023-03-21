import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

export function Search({ onSearch }) {
  const handleSearch = (e) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <InputGroup
      width="100%"
      maxW="400px"
      m="16px auto"
      justifyContent={"center"}
    >
      <InputLeftElement pointerEvents="none">
        <SearchIcon color="gray.300" />
      </InputLeftElement>
      <Input
        type="text"
        placeholder="Search..."
        onChange={handleSearch}
        borderRadius="2xl"
        border={"none"}
      />
    </InputGroup>
  );
}
