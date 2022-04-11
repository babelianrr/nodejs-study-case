import { Modal, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

export default function ApproveOrder({ showApprove, handleCloseApprove, setApproveOrder }) {
  const { t } = useTranslation()
  const handleApprove = () => {
    setApproveOrder(true)
  }

  return (
    <Modal show={showApprove} onHide={handleCloseApprove} centered>
      <Modal.Body>
        <div className="fs-24 fw-9">
          {t('warning')}
        </div>
        <div className="fs-16 fw-5 mt-2">
          {t('confirm_acc')}
        </div>
        <div className="text-end mt-5">
          <Button onClick={handleApprove} size="sm" className="btn-success me-2" style={{ width: '135px' }}>{t('yes')}</Button>
          <Button onClick={handleCloseApprove} size="sm" className="btn-danger" style={{ width: '135px' }}>{t('no')}</Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}
