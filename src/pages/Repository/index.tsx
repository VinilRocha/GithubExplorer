import React, { useEffect, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Link, useRouteMatch } from 'react-router-dom';

import api from '../../services/api';

import logoImg from '../../assets/img/logo.svg';

import { Header, RepositoryInfo, Issues } from './styles';

interface RepositoryParams {
    repository: string;
}

interface Repository {
    full_name: string;
    description: string;
    stargazers_count: number;
    forks_count: number;
    open_issues_count: number;
    owner: {
        login: string;
        avatar_url: string;
    };
}

interface Issue {
    id: number;
    title: string;
    html_url: string;
    user: {
        login: string;
    };
}

const Repository: React.FC = () => {
    const { params } = useRouteMatch<RepositoryParams>();

    const [repository, setRepository] = useState<Repository | null>(null);
    const [issues, setIssues] = useState<Issue[]>([]);

    useEffect(() => {
        // api.get(`/repos/${params.repository}`).then(response => {
        //     console.log(response);
        // });
        // api.get(`/repos/${params.repository}/issues`).then(response => {
        //     console.log(response);
        // });

        async function loadData() {
            const [repositoryData, issuesData] = await Promise.all([
                api.get(`/repos/${params.repository}`),
                api.get(`/repos/${params.repository}/issues`),
            ]);
            setRepository(repositoryData.data);
            setIssues(issuesData.data);
        }

        loadData();
    }, [params.repository]);

    return (
        <>
            <Header>
                <img src={logoImg} alt="GithubExplorer" />
                <Link to="/">
                    <FiChevronLeft size={20} />
                    Voltar
                </Link>
            </Header>

            {repository && (
                <RepositoryInfo>
                    <header>
                        <img
                            src={repository.owner.avatar_url}
                            alt={repository.owner.login}
                        />
                        <div>
                            <strong>{repository.full_name}</strong>
                            <p>{repository.description}</p>
                        </div>
                    </header>
                    <ul>
                        <li>
                            <strong>{repository.stargazers_count}</strong>
                            <span>Stars</span>
                        </li>
                        <li>
                            <strong>{repository.forks_count}</strong>
                            <span>Forks</span>
                        </li>
                        <li>
                            <strong>{repository.open_issues_count}</strong>
                            <span>Issues abertas</span>
                        </li>
                    </ul>
                </RepositoryInfo>
            )}

            <Issues>
                {issues.map(issue => (
                    <a
                        key={issue.id}
                        href={issue.html_url}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <div>
                            <strong>{issue.title}</strong>
                            <p>{issue.user.login}</p>
                        </div>
                        <FiChevronRight size={20} />
                    </a>
                ))}
            </Issues>
        </>
    );
};

export default Repository;
