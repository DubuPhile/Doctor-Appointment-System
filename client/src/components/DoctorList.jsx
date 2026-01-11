import "../styles/DoctorCard.css"
import { useNavigate } from "react-router-dom";


const DoctorList = ({ doctor }) => {
    const navigate = useNavigate();

  return (
    <>
        <div 
            className="flip-card" 
            onClick={() => navigate(`/book-appointment/${doctor.userId}`)}
            style={{cursor: 'pointer'}}
        >
        <div className = "flip-card-inner">
            <div className ="flip-card-front">
                <div>
                    <img 
                        src = "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
                        className = "doctorImg"
                    />
                </div>
                <p className = "doctorName">Dr. { doctor.firstName + " " + doctor.lastName }</p>
                <p><b>Schedule: {doctor.timings?.map(t => t.format('HH:mm')).join(' - ')}</b></p>
            </div>
            <div className = "flip-card-back">
                <div className = "DoctorDescription">
                    <p>
                        <b>Specialization:</b> {doctor.specialization}
                    </p>
                    <p>
                        <b>Experience:</b> {doctor.experience}
                    </p>
                    <p>
                        <b>Fees Per Consultation:</b> {doctor.feesPerConsultation}
                    </p>
                </div>
            </div>
        </div>
            
        </div>
    </>
  )
}

export default DoctorList