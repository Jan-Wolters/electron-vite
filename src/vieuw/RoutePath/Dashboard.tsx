import ListGroup from "../MainParts/ListGroup.tsx";
import NavBar from "../components/NavBar";

function Dashboard() {
  return (
    <div className="w-auto  mx-5 overflow-hidden shadow-lg">
      <NavBar />
      <ListGroup />{" "}
    </div>
  );
}

export default Dashboard;
