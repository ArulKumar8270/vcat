import Loading from '../components/img/logo.png';
import AppConfig from '../modals/AppConfig';
import Modal from 'react-bootstrap/Modal';
import { observer } from 'mobx-react';


const Loader = () => {
    return (
        <>
            <div>
                {
                    AppConfig.loader ?
                        <div style={{maxWidth:'1200px'}}>
                            <Modal
                                show={AppConfig.loader}
                                className="loaders"
                                centered
                                backdropClassName="modal-content-loader modal-backdrop-loader"
                            >
                                <Modal.Body className='modal-content-loader'>
                                    <div className="d-flex justify-content-center m-5 p-5">
                                        <img src={Loading} alt='loader' />
                                    </div>
                                </Modal.Body>
                            </Modal>
                        </div>
                        :
                        null
                }
            </div>
        </>
    )
}
export default observer(Loader);
