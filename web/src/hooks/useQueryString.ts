import { useLocation } from 'react-router-dom';

export default function useQueryString() {
	return new URLSearchParams(useLocation().search);
}
