import { Modal, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

export default function CompleteOrder({ show, handleClose, setCompleteOrder }) {
  const { t } = useTranslation();
  const handleComplete = () => {
    setCompleteOrder(true)
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Body>
        <div className="fs-24 fw-9">
          {t('warning')}
        </div>
        <div className="fs-16 fw-5 mt-2">
          {t('confirm_com')}
        </div>
        <div className="text-end mt-5">
          <Button onClick={handleComplete} size="sm" className="btn-success me-2" style={{ width: '135px' }}>{t('yes')}</Button>
          <Button onClick={handleClose} size="sm" className="btn-danger" style={{ width: '135px' }}>{t('no')}</Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}
