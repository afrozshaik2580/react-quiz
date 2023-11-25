function Header() {
    return (
      <header className='app-header'>
        <img src={require("./icon.png")} alt='React logo' />
        <h1>The React Quiz</h1>
      </header>
    );
  }
  
  export default Header;