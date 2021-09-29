import { VaultConstants } from '../constants/vault.constants';

const VaultActions = {
  updateCollateral,
};

function updateCollateral(collateral) {
  return dispatch => {
    dispatch(_updateCollateral(collateral));
  };
}

const _updateCollateral = collateral => {
  return {
    type: VaultConstants.UPDATE_COLLATERAL,
    collateral,
  };
};

export default VaultActions;
