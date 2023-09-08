import ListGroup from "./ListGroup";
import NavBar from "./components/NavBar";

function Dashboard() {
  return (
    <div className="w-75 mx-auto container overflow-hidden">
      <NavBar />
      <ListGroup />{" "}
    </div>
  );
}

export default Dashboard;
