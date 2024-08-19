import React from 'react';
import PropTypes from 'prop-types';

export default function EditThisPage({ editUrl }) {
    return (
        <a href={editUrl} target="_blank" rel="noopener noreferrer">
            Edit this page
        </a>
    );
}

EditThisPage.propTypes = {
    editUrl: PropTypes.string.isRequired,
};
