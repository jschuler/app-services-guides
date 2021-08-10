import React, { FunctionComponent } from "react";
import {
  TextContent,
  Text,
  Divider,
  Gallery,
  GalleryItem,
  ToolbarContent,
} from "@patternfly/react-core";
import {
  getQuickStartStatus,
  QuickStartContextValues,
  QuickStartContext,
  QuickStartTile,
  filterQuickStarts,
  QuickStartCatalogEmptyState,
  QUICKSTART_SEARCH_FILTER_KEY,
  QuickStartCatalogFilterSearchWrapper,
  QuickStartCatalogFilterCountWrapper,
  QuickStartCatalog,
  QuickStartCatalogSection,
  QuickStartCatalogHeader,
  QuickStartCatalogToolbar,
} from "@patternfly/quickstarts";
import { GuidesQuickStart } from "./procedure-parser";
import "./Catalog.css";

const MasQuickStartCatalog: React.FC = ({ qs }) => {
  debugger;
  const { activeQuickStartID, allQuickStartStates, allQuickStarts = qs } =
    React.useContext<QuickStartContextValues>(QuickStartContext);

  const initialQueryParams = new URLSearchParams(window.location.search);
  const initialSearchQuery =
    initialQueryParams.get(QUICKSTART_SEARCH_FILTER_KEY) || "";

  const sortFnc = (q1: GuidesQuickStart, q2: GuidesQuickStart) => {
    const q1Order = q1.metadata.annotations?.order;
    const q2Order = q2.metadata.annotations?.order;
    if (q1Order && !q2Order) {
      return -1;
    } else if (!q1Order && q2Order) {
      return 1;
    } else if (!q1Order && !q2Order) {
      return q1.spec.displayName.localeCompare(q2.spec.displayName);
    } else if (q1Order && q2Order) {
      return q1Order - q2Order;
    }
    return 0;
  };

  const initialFilteredQuickStarts = filterQuickStarts(
    allQuickStarts,
    initialSearchQuery,
    [],
    allQuickStartStates
  ).sort(sortFnc);

  const [filteredQuickStarts, setFilteredQuickStarts] = React.useState<
    GuidesQuickStart[]
  >(initialFilteredQuickStarts);

  const onSearchInputChange = (searchValue: string) => {
    const result = filterQuickStarts(
      allQuickStarts,
      searchValue,
      [],
      allQuickStartStates
    ).sort(sortFnc);
    setFilteredQuickStarts(result);
  };

  const CatalogWithSections = (
    <>
      <QuickStartCatalogSection>
        <TextContent>
          <Text component="h2">Quick starts</Text>
          <Text component="p" className="mk-catalog-sub">
            Step-by-step instructions and tasks
          </Text>
        </TextContent>
        <Gallery className="pfext-quick-start-catalog__gallery" hasGutter>
          {allQuickStarts
            .filter(
              (quickStart) =>
                !quickStart.spec.type ||
                quickStart.spec.type.text !== "Documentation"
            )
            .sort(sortFnc)
            .map((quickStart) => {
              const {
                metadata: { name: id },
              } = quickStart;

              return (
                <GalleryItem
                  key={id}
                  className="pfext-quick-start-catalog__gallery-item"
                >
                  <QuickStartTile
                    quickStart={quickStart}
                    isActive={id === activeQuickStartID}
                    status={getQuickStartStatus(allQuickStartStates, id)}
                  />
                </GalleryItem>
              );
            })}
        </Gallery>
      </QuickStartCatalogSection>
      <QuickStartCatalogSection>
        <Divider />
      </QuickStartCatalogSection>
      <QuickStartCatalogSection>
        <TextContent>
          <Text component="h2">Documentation</Text>
          <Text component="p" className="mk-catalog-sub">
            Technical information for using the service
          </Text>
        </TextContent>
        <Gallery className="pfext-quick-start-catalog__gallery" hasGutter>
          {allQuickStarts
            .filter(
              (quickStart) => quickStart.spec.type?.text === "Documentation"
            )
            .sort(sortFnc)
            .map((quickStart) => {
              const {
                metadata: { name: id },
              } = quickStart;

              return (
                <GalleryItem
                  key={id}
                  className="pfext-quick-start-catalog__gallery-item"
                >
                  <QuickStartTile
                    quickStart={quickStart}
                    isActive={id === activeQuickStartID}
                    status={getQuickStartStatus(allQuickStartStates, id)}
                  />
                </GalleryItem>
              );
            })}
        </Gallery>
      </QuickStartCatalogSection>
    </>
  );

  const clearFilters = () => {
    setFilteredQuickStarts(allQuickStarts.sort(sortFnc));
  };
  debugger;
  return (
    <>
      <QuickStartCatalogHeader title="Resources" />
      <Divider component="div" />
      <QuickStartCatalogToolbar>
        <ToolbarContent>
          <QuickStartCatalogFilterSearchWrapper
            onSearchInputChange={onSearchInputChange}
          />
          <QuickStartCatalogFilterCountWrapper
            quickStartsCount={filteredQuickStarts.length}
          />
        </ToolbarContent>
      </QuickStartCatalogToolbar>
      <Divider component="div" />
      {filteredQuickStarts.length === 0 ? (
        <QuickStartCatalogEmptyState clearFilters={clearFilters} />
      ) : filteredQuickStarts.length !== allQuickStarts.length ? (
        <QuickStartCatalog quickStarts={filteredQuickStarts} />
      ) : (
        CatalogWithSections
      )}
    </>
  );
};

const QuickStartCatalogFederated: FunctionComponent = ({ qs }) => (
  <MasQuickStartCatalog qs={qs} />
);

export default QuickStartCatalogFederated;