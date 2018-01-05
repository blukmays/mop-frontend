import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { searchPetitions } from '../actions/petitionActions.js'
import SearchResultPagination from '../components/search-result-pagination'

class SearchResults extends React.Component {

  componentDidMount() {
    const { searchPetitions, query, pageNumber } = this.props
    searchPetitions(query, pageNumber)
  }

  render() {
    const { searchResults, currentPage, query } = this.props
    const resultCount = searchResults.count
    const pageSize = searchResults.page_size
    const resultsEmbed = searchResults._embed
    const searchNavLinks = searchResults._links

    const resultsList = resultsEmbed.map((result, index) => (
      <div className='result' key={index}>
        <div className='result-text'>
          <p className='result-name'>
            <a className='size-medium-large font-heavy' href={`http://pac.petitions.moveon.org/sign/${result.short_name}/?source=search`}>
                {result.name}
            </a>
          </p>
          <p className='size-small'>http://pac.petitions.moveon.org/sign/{result.short_name}/</p>
          <p className='size-medium'>{result.blurb}</p>
        </div>
      </div>
      )
    )


    return (
      <div id='search-results'>
        {resultsList}
        <SearchResultPagination resultCount={resultCount} pageSize={pageSize} currentPage={currentPage} searchNavLinks={searchNavLinks} query={query} />
      </div>
    )
  }
}

SearchResults.propTypes = {
  searchResults: PropTypes.object,
  currentPage: PropTypes.number,
  query: PropTypes.string,
  searchPetitions: PropTypes.func,
  pageNumber: PropTypes.number
}

const mapStateToProps = (store, ownProps) => {
  const searchResults = store.petitionSearchStore.searchResults

  return {
    searchResults,
    currentPage: parseInt(ownProps.pageNumber, 10)
  }
}

const mapDispatchToProps = (dispatch) => ({
  searchPetitions: (query, pageNumber) =>
    dispatch(searchPetitions(query, pageNumber))
})

export default connect(mapStateToProps, mapDispatchToProps)(SearchResults)
