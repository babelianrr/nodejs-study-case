import { Modal, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

export default function DeleteData({ show, handleClose, setConfirmDelete }) {
	const { t } = useTranslation()
	const handleDelete = () => {
		setConfirmDelete(true)
	}

	return (
		<Modal show={show} onHide={handleClose} centered>
			<Modal.Body className="text-dark">
				<div style={{ fontSize: '20px', fontWeight: '900' }}>
					{t('warning')}
				</div>
				<div style={{ fontSize: '16px', fontWeight: '500' }} className="mt-2">
					{t('confirm_del')}
				</div>
				<div className="text-end mt-5">
					<Button onClick={handleDelete} size="sm" className="btn-success me-2" style={{ width: '135px' }}>{t('yes')}</Button>
					<Button onClick={handleClose} size="sm" className="btn-danger" style={{ width: '135px' }}>{t('no')}</Button>
				</div>
			</Modal.Body>
		</Modal>
	)
}
