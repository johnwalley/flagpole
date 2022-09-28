import { Allotment } from "allotment";
import "allotment/dist/style.css";

const AllotmentComponent = () => (
  <div style={{ height: "200px" }}>
    <Allotment>
      <div>Page 1</div>
      <div>Page 2</div>
    </Allotment>
  </div>
);

export default AllotmentComponent;
