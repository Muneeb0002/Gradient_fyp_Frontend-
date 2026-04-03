import { useQuery } from '@tanstack/react-query';
import { fetchMapData } from '../map.api.js/mapService.js';

const useMapQuery = (searchQuery) => {
    return useQuery({
        queryKey: ['mapData', searchQuery], // Unique key for caching
        queryFn: () => fetchMapData(searchQuery),
        enabled: !!searchQuery, // Sirf tab chalay jab query empty na ho
        staleTime: 1000 * 60 * 5, // 5 minutes tak data fresh rahega
    });
};

export default useMapQuery;