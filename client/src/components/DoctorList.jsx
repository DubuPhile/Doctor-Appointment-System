import { useCallback } from "react"
import { useNavigate } from "react-router-dom";


const DoctorList = ({ doctor }) => {
    const navigate = useNavigate();

    const CapitalizedFirstLetter = useCallback((string) => {
        if (!string) return "";
        return string.charAt(0).toUpperCase() + string.slice(1);
    })
  return (
    <>
        <div 
            className="card m-2" 
            onClick={() => navigate(`/book-appointment/${doctor.userId}`)}
            style={{cursor: 'pointer'}}
        >
            <header className="card-header text-center">
                Dr. { CapitalizedFirstLetter(doctor.firstName) + " " + CapitalizedFirstLetter(doctor.lastName) } 
            </header>
            <div className="card-body">
                <p>
                    <b>Specialization: {doctor.specialization}</b>
                </p>
                <p>
                    <b>Experience: {doctor.experience}</b>
                </p>
                <p>
                    <b>Fees Per Consultation: {doctor.feesPerConsultation}</b>
                </p>
                <p>
                    <b>Timings: {doctor.timings?.map(t => t.format('HH:mm')).join('-')}</b>
                </p>
            </div>
        </div>
    </>
  )
}

export default DoctorList