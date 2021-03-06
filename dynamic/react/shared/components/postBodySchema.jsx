import React from 'react';

import PostBodyItemSchema from './postBodyItemSchema';
import {hasExcludedProperties} from '../helpers';

const PostBodySchema = (props) => (
    <div>
        {hasExcludedProperties(props.postBody) ?
            <div className={'clickable'} onClick={props.onToggleShowExcludedPostBodyProps.bind(null, props.id)}>
                <span className={`glyphicon glyphicon-${props.endpoint.showExcludedPostBodyFields ? 'minus' : 'plus'}`}></span><span>{` ${props.endpoint.showExcludedPostBodyFields ? 'Hide advanced' : 'Show all'} request attributes`}</span>
            </div> : null}
        <form className={'api-console-post-form'} onSubmit={
            (e) => {
                e.preventDefault();
                props.onSubmitConsoleRequest(props.endpoint, props.id);
            }
        }>
            {
                <PostBodyItemSchema
                    canRemove={false}
                    displayName={'Post Body'}
                    endpointId={props.id}
                    itemSchema={props.postBody}
                    itemValue={props.postBodyData}
                    name={''}
                    onAddItemToPostbodyCollection={props.onAddItemToPostbodyCollection}
                    onPostBodyInputChanged={props.onPostBodyInputChanged}
                    onRemovePostbodyCollectionItem={props.onRemovePostbodyCollectionItem}
                    showExcludedPostBodyFields={props.showExcludedPostBodyFields}
                />
            }
            <input style={{display: 'none'}} type={'submit'} value={'submit'}/>
        </form>
    </div>
);

PostBodySchema.displayName = 'Post Body';
PostBodySchema.propTypes = {
    endpoint: React.PropTypes.shape({
        apiResponse: React.PropTypes.shape({
            status: React.PropTypes.string.isRequired,
            statusMessage: React.PropTypes.string.isRequired,
            body: React.PropTypes.oneOfType([
                React.PropTypes.object, React.PropTypes.array
            ]).isRequired
        }),
        name: React.PropTypes.string.isRequired,
        description: React.PropTypes.string.isRequired,
        curl: React.PropTypes.string.isRequired,
        isAuthenticated: React.PropTypes.bool.isRequired,
        path: React.PropTypes.string.isRequired,
        action: React.PropTypes.string.isRequired,
        queryString: React.PropTypes.objectOf(
            React.PropTypes.shape({
                description: React.PropTypes.string,
                example: React.PropTypes.any,
                required: React.PropTypes.bool,
                value: React.PropTypes.any.isRequired
            })
        ),
        pathParams: React.PropTypes.objectOf(
            React.PropTypes.shape({
                description: React.PropTypes.string,
                example: React.PropTypes.any,
                required: React.PropTypes.bool,
                value: React.PropTypes.any.isRequired
            })
        ),
        postBody: React.PropTypes.object
    }).isRequired,
    id: React.PropTypes.number.isRequired,
    name: React.PropTypes.string.isRequired,
    onAddItemToPostbodyCollection: React.PropTypes.func.isRequired,
    onPostBodyInputChanged: React.PropTypes.func.isRequired,
    onRemovePostbodyCollectionItem: React.PropTypes.func.isRequired,
    onSubmitConsoleRequest: React.PropTypes.func.isRequired,
    postBody: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.array]),
    postBodyData: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.array]),
    showExcludedPostBodyFields: React.PropTypes.bool.isRequired
};

export default PostBodySchema;
