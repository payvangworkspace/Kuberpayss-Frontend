import { Fragment } from 'react'
import styles from './modal.module.css'
import { createPortal } from 'react-dom'
const Backdrop = ({ onClick }) => {
    return <div className="backdrop" onClick={onClick}></div>
}
const Overlay = ({ onClick, handleSettle }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        const utr = e.target.utrNo.value;
        const desc = e.target.description.value;
        handleSettle(utr, desc)
    }
    return (
        <div className={styles.modal}>
            <h6>
                Settle
            </h6>
            <form className='row' id="form" onSubmit={handleSubmit}>
                <div className='col-12 mb-3'>
                    <label htmlFor='utrNo'> UTR Number</label>
                    <input type='text' id='utrNo' name='utrNo' className='col-md-12 mt-2' required />
                </div>
                <div className='col-12 mb-3'>
                    <label htmlFor='utrNo'> Description</label>
                    <textarea type='text' id='description' name='description' className='col-md-12 mt-2' rows={3} />
                </div>
                <div className='col-md-12'>
                    <button type='button' className='btn btn-secondary me-2' onClick={onClick}> Cancel </button>
                    <button type='submit' className='btn btn-primary' form='form'> Settle </button>
                </div>
            </form>
        </div>
    )
}
export const SettleModal = ({ data, onClose, onsuccess, settle }) => {
    return (
        <Fragment>
            {createPortal(<Backdrop onClick={onClose} />, document.getElementById('backdrop'))}
            {createPortal(<Overlay data={data} onSuccess={onsuccess} onClick={onClose} handleSettle={settle} />, document.getElementById('overlay'))}
        </Fragment>
    )
}