import Login from "../components/login";
import Logout from "../components/Logout";

function Home() {
    return ( 
        <div>
            <Login/><hr /><br />
            <Logout/>
        </div>
     );
}

export default Home;