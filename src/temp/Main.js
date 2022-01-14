import React, { useEffect, useState, useCallback } from 'react';
import { Virtuoso } from 'react-virtuoso';
import loader from '../loader.gif';
import _ from 'lodash'; 
let page = 1;

const Main = () => {
const [pullRequests, setPullRequests] = useState([]);
const [loading, setLoading] = useState(!1)

const fetchPost =  useCallback(async () => {
        const res = await fetch(`https://api.github.com/repos/neovim/neovim/pulls?page=${page}`,{
            headers:{
                'Accept':'application/vnd.github.v3+json',
                'Authorization': 'token '+process.env.REACT_APP_GIT_TOKEN
            }
        });
        const json = await res.json();
        if(json.length > 0){
            setPullRequests(value => ([...value, ...json ]))
            page += 1;
            setLoading(!0)
        }else{
            setLoading(!1)
        }
}, [setPullRequests])
console.log(pullRequests);
const layout = () => (
    <div className="git-pull-requests">
       <ul className="pull-info">
            <li className="head-li">Title</li>
            <li className="head-li">Base Branch</li>
            <li className="head-li">Author Branch</li>
            <li className="head-li">Author</li>
            <li className="head-li">Created at</li>
            <li className="head-li">Reviews</li>
            <li className="head-li">Labels</li>
        </ul>
                <Virtuoso
                style={{height:'500px'}}
                totalCount={1}
                data={pullRequests}
                endReached={fetchPost}
                itemContent={(i, p) => (<>
                  {!_.isEmpty(p) &&
                    <div key={i+Date.now()} className="pull-requests">
                        <div className={`pull-request-${p.id}`}>
                            <ul className="pull-info">
                                <li className="overflow"><a href={p.url} target="_blank">{p.title}</a></li>
                                <li>{p.base.repo.default_branch}</li>
                                <li>{p.author_association}</li>
                                <li>{_.isEmpty(p.head.user) ? '' :p.head.user.login}</li>
                                <li>{p.base.repo.created_at}</li>
                                <li>{p.number}</li>
                                <li>{p.labels.length > 0 ? p.labels[0].name : ''}</li>
                            </ul>
                        </div>
                    </div>}
                </>)}
                components={{
                    Footer: () => (
                    <span style={{textAlign: 'center', display: 'block'}}>
                      {loading &&  <img src={loader} height={48} width={48} />}
                    </span>
                    )
                }}
                />
    </div>
)

useEffect(() => {
    fetchPost();
},[])

    return (
       <main className="git">
         {layout()}
       </main>
    );
};

export default Main;