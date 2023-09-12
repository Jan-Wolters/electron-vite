import ListGroup from "../MainParts/ListGroup.tsx";
import NavBar from "../components/NavBar";

function Dashboard() {
  return (
    <div className="w-75 mx-auto container overflow-hidden shadow-lg">
      <NavBar />
      <ListGroup />{" "}
    </div>
  );
}

export default Dashboard;
