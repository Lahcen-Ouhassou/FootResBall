import { useParams } from "react-router-dom";
import ReservationForm from "./ReservationForm";

export default function EditReservationPage() {
  const { id } = useParams();

  return (
    <div className="p-6">
      <ReservationForm editId={id} />
    </div>
  );
}
