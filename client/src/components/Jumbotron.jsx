import React from 'react';
import { useTranslation } from 'react-i18next';

function Jumbotron() {
  const { t } = useTranslation();

  return (
    <div>
      <div className="container">
        <div className="jumbotron mt-5 p-lg-3">
          <div className="row">
            <div className="col-xl-7 col-lg-6 col-md-6 col-sm-10">
              <p className="mx-3 mx-md-5 mx-sm-2 mt-5 text-white fw-9 fre-60">WAYSBUCKS</p>
              <p className="mx-3 mx-md-5 mx-sm-2 text-white fw-3 fs-24">{t('jumbotron_header')}</p>
              <p className="mx-3 mx-md-5 mx-sm-2 mb-xl-5 mb-lg-3 text-white fw-3 fs-18">
                {t('jumbotron_text1')}<br />
                {t('jumbotron_text2')} <br />
                {t('jumbotron_text3')}
              </p>
              <p className="mx-3 mx-md-5 mx-sm-2 mb-5 text-white fw-3 fs-18">{t('lets_order')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Jumbotron;
