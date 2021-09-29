import { VaultConstants } from '../constants/vault.constants';

export function Vault(
  state = {
    collateral: 0,
  },
  action
) {
  switch (action.type) {
    case VaultConstants.UPDATE_COLLATERAL: {
      return {
        collateral: action.collateral,
      };
    }
    default: {
      return state;
    }
  }
}
