import SearchInput from "./Components/SearchInput/SearchInput";
import MenuButton from "./Components/MenuButton/MenuButton";
import { searchAPI } from "./workWithAPI/WorkWithAPI";

function App() {
  const onclick = async () => {
    searchAPI("bedroom");
  };

  return (
    <div className="app">
      <SearchInput img="/searchIcon.svg" id="search" type="text" placeholder="Search by song or author" autoComplete="off"></SearchInput>
      <MenuButton img="/playlist.svg" active={true}>Button</MenuButton>
      <MenuButton onClick={onclick} img="/searchIcon.svg" active={false}>Button</MenuButton>
    </div>
  );
}

export default App;
