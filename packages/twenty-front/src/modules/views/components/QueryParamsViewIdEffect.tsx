import { useLastVisitedObjectMetadataItem } from '@/navigation/hooks/useLastVisitedObjectMetadataItem';
import { useLastVisitedView } from '@/navigation/hooks/useLastVisitedView';
import { useFilteredObjectMetadataItems } from '@/object-metadata/hooks/useFilteredObjectMetadataItems';
import { useRecoilComponentStateV2 } from '@/ui/utilities/state/component-state/hooks/useRecoilComponentStateV2';
import { useViewFromQueryParams } from '@/views/hooks/internal/useViewFromQueryParams';
import { useGetCurrentView } from '@/views/hooks/useGetCurrentView';
import { useSetViewInUrl } from '@/views/hooks/useSetViewInUrl';
import { currentViewIdComponentState } from '@/views/states/currentViewIdComponentState';
import { isUndefined } from '@sniptt/guards';
import { useEffect } from 'react';
import { isDeeplyEqual } from '~/utils/isDeeplyEqual';
import { isDefined } from '~/utils/isDefined';

export const QueryParamsViewIdEffect = () => {
  const { getFiltersFromQueryParams, viewIdQueryParam } =
    useViewFromQueryParams();

  // TODO: fix this implicit hack
  const { instanceId: objectNamePlural } = useGetCurrentView();

  const [currentViewId, setCurrentViewId] = useRecoilComponentStateV2(
    currentViewIdComponentState,
  );

  const { viewsOnCurrentObject } = useGetCurrentView();
  const { findObjectMetadataItemByNamePlural } =
    useFilteredObjectMetadataItems();
  const objectMetadataItemId =
    findObjectMetadataItemByNamePlural(objectNamePlural);
  const { getLastVisitedViewIdFromObjectNamePlural, setLastVisitedView } =
    useLastVisitedView();
  const { lastVisitedObjectMetadataItemId, setLastVisitedObjectMetadataItem } =
    useLastVisitedObjectMetadataItem();

  const lastVisitedViewId =
    getLastVisitedViewIdFromObjectNamePlural(objectNamePlural);
  const isLastVisitedObjectMetadataItemDifferent = !isDeeplyEqual(
    objectMetadataItemId?.id,
    lastVisitedObjectMetadataItemId,
  );
  const { setViewInUrl } = useSetViewInUrl();

  // // TODO: scope view bar per view id if possible
  // const { resetCurrentView } = useResetCurrentView();

  // useEffect(() => {
  //   if (isDefined(currentViewId)) {
  //     resetCurrentView();
  //   }
  // }, [resetCurrentView, currentViewId]);

  useEffect(() => {
    const indexView = viewsOnCurrentObject.find((view) => view.key === 'INDEX');

    if (isUndefined(viewIdQueryParam) && isDefined(lastVisitedViewId)) {
      if (isLastVisitedObjectMetadataItemDifferent) {
        setLastVisitedObjectMetadataItem(objectNamePlural);
        setLastVisitedView({
          objectNamePlural,
          viewId: lastVisitedViewId,
        });
      }
      setCurrentViewId(lastVisitedViewId);
      setViewInUrl(lastVisitedViewId);
      return;
    }

    if (isDefined(viewIdQueryParam)) {
      if (isLastVisitedObjectMetadataItemDifferent) {
        setLastVisitedObjectMetadataItem(objectNamePlural);
      }
      if (!isDeeplyEqual(viewIdQueryParam, lastVisitedViewId)) {
        setLastVisitedView({
          objectNamePlural,
          viewId: viewIdQueryParam,
        });
      }
      setCurrentViewId(viewIdQueryParam);
      return;
    }

    if (isDefined(indexView)) {
      if (isLastVisitedObjectMetadataItemDifferent) {
        setLastVisitedObjectMetadataItem(objectNamePlural);
      }
      if (!isDeeplyEqual(indexView.id, lastVisitedViewId)) {
        setLastVisitedView({
          objectNamePlural,
          viewId: indexView.id,
        });
      }
      setCurrentViewId(indexView.id);
      return;
    }
  }, [
    currentViewId,
    getFiltersFromQueryParams,
    isLastVisitedObjectMetadataItemDifferent,
    lastVisitedViewId,
    objectMetadataItemId?.id,
    objectNamePlural,
    setCurrentViewId,
    setLastVisitedObjectMetadataItem,
    setLastVisitedView,
    setViewInUrl,
    viewIdQueryParam,
    viewsOnCurrentObject,
  ]);

  return <></>;
};
