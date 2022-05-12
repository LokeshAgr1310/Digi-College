import { doc, getDoc, query, getDocs, where, collection } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import LibraryIssueBook from './LibraryIssueBook'
import LibraryReturnBook from './LibraryReturnBook'

function LibrarianDashboard() {

    const toastPropertyProps = {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    }

    const tabs = ['Issue Book', 'Return Book']

    const [activeTab, setActiveTab] = useState(tabs[0])

    useEffect(() => {

    }, [activeTab])


    return (
        <div className='text'>
            <div className='container'>
                <div className='d-flex mt-3 justify-content-center align-items-center'>
                    <ul className="nav subject-tab mb-3">
                        {tabs.map((tab, index) => (
                            <li className="nav-item" key={index}>
                                <a
                                    className={`nav-link ${(activeTab === tab) ? "active" : ""}`}
                                    href="#"
                                    onClick={() => setActiveTab(tab)}
                                >
                                    <div className='d-flex flex-column justify-conten-center align-items-center'>
                                        <span>{tab}</span>
                                    </div>
                                </a>
                            </li>

                        ))}

                    </ul>
                </div>
                {
                    activeTab === 'Issue Book'
                        ? <LibraryIssueBook toastPropertyProps={toastPropertyProps} />
                        : <LibraryReturnBook toastPropertyProps={toastPropertyProps} />
                }
            </div>
            <ToastContainer style={{
                fontSize: '15px'
            }} />
        </div>
    )
}

export default LibrarianDashboard



