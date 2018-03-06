import React from 'react'
import PropTypes from 'prop-types'

import { text2paraJsx } from '../../lib'
import SignatureAddForm from '../../containers/signature-add-form'
import SignatureCount from 'LegacyTheme/signature-count'
import SignatureList from '../../containers/signature-list'
import PetitionFlagForm from '../../containers/petition-flag-form'
import { Link } from 'react-router'

const Petition = ({ petition: p, query, petitionBy, outOfDate }) => {
  const petitionListIds = p.identifiers
    .filter((ident) => /^list_id:/.test(ident))
    .map((ident) => ident.substr(8))
  return (
  <div className='container'>
    {(outOfDate) ?
      <div className='message-header'>
        <span className='bell'>This petition has not been edited in a while. As a new legislative session has begun, it’s possible some of the targets of this petition are out of date.</span>
      </div>
      : ''}

    {(p.status !== 'Verified') ?
      <div className='message-header'>
        <PetitionFlagForm petition={p} />
      </div>
      : ''}

    {(p.status === 'Bad') ?
      <div className='message-header'>
        <span className='bell'>MoveOn volunteers reviewed this petition and determined that it either may not reflect MoveOn members&#39; progressive values, or that MoveOn members may disagree about whether to support this petition. MoveOn will not promote the petition beyond hosting it on our site. <a href='https://act.moveon.org/cms/thanks/thanks-your-input' target='_blank'>Click here</a> if you think MoveOn should support this petition.
        </span>
      </div>
      : ''}

    {(p.tags && p.tags.filter(t => t.name === 'outcome:victory').length) ?
      <div className='message-header'>
        <img alt='star icon' src='/images/star.png' height='30' width='30' />
        <span><strong>Victory!</strong> The creator of this petition declared the campaign a success. You can still sign the petition to show support.</span>
      </div>
      : ''}

    {(query.fwd) ?
      <div className='message-header'>
        <span className='bell'>  We&#39;ve forwarded you to this trending petition.  To return to your previous action, use your browser&#39;s back button.
        </span>
      </div>
      : ''}

    <div className='row'>
      <SignatureAddForm petition={p} query={query} />

      <div className='span8 pull-right petition-info-top'>
        <div className='percent-95 padding-left-15 form-wrapper responsive padding-bottom-1 padding-left-2 padding-right-3' style={{ marginLeft: '-20px', position: 'relative' }}>
          <div className='petition-top hidden-phone'>
            <h1 id='petition-title' className='moveon-bright-red big-title'>{p.title}</h1>
            <p id='by' className='byline lh-20'>
              Petition by <a href={`/contact_creator.html?petition_id=${p.petition_id}`} className='underline'>
                  {petitionBy}
              </a>
            </p>
            <p id='to-target' className='lh-14 bump-top-1 bump-bottom-1 margin-0 disclaimer'>To be delivered to <span className='all-targets'><strong>
                {p.target.map((t) => t.name).join(', ')}</strong></span></p>
          </div>
          <div id='pet-statement-box' className='lh-36 blockquote'>
            <h3 className='visible-phone moveon-bright-red'>Petition Statement</h3>
            <div id='pet-statement'>{text2paraJsx(p.summary)}</div>
          </div>

          <SignatureCount current={p.total_signatures} goal={p.signature_goal} />
        </div>

        <div className='clear'></div>

        <div id='pet-explain' className='background-moveon-white bump-top-1 padding-left-2' style={{ marginLeft: '-20px' }}>
          <div className='widget'>
            <div className='widget-top'>
              <h3 className='moveon-bright-red padding-bottom-1'>Petition Background</h3>
            </div>
            {p.featured_image_url ? (
              <img id='pet-image' src={p.featured_image_url} role='presentation' />
            ) : ''}
            <div dangerouslySetInnerHTML={{ __html: p.description }}></div>
          </div>

          <div className='widget hidden-phone'>
            <div className='widget-top'>
              <h3 className='moveon-bright-red padding-bottom-1'>Current petition signers</h3>
            </div>

            <SignatureList
              petitionSlug={p.slug}
              petitionListId={petitionListIds.length ? petitionListIds[0] : null}
              signatureCount={p.total_signatures}
            />

            <div>
              <div id='pet-signers' className='bump-top-1'>
              </div>
              <form id='flag-comment-form' action='/flag_comment.html' method='POST'>
                <input id='flag-comment-user-id' type='hidden' name='user_id' value='' />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className='row'>
      <div className='span12'>
        <div id='privacy'>
          <p className='disclaimer bump-top-2'>
            <strong>Note</strong>: MoveOn {p.entity === 'c4' ? 'Civic' : 'Political'} Action does not necessarily endorse the contents of petitions posted on this site. MoveOn Petitions is an open tool that anyone can use to post a petition advocating any point of view, so long as the petition does not violate our <Link to='/terms.html'>terms of service</Link>.
          </p>
        </div>
      </div>
    </div>
  </div>
)}

Petition.propTypes = {
  petition: PropTypes.object.isRequired,
  query: PropTypes.object,
  petitionBy: PropTypes.string,
  outOfDate: PropTypes.string
}

export default Petition
