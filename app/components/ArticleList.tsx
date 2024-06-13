import { useEffect, useState } from "react";
import Link from 'next/link';
import { TrashIcon, RocketLaunchIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
import { Article } from "./types";
import InputArticle from "../components/InputArticle";
import LevelComponent from "./LevelComponent"

const ArticleList: React.FC<{ wordList: Article[], onCollectionChange: (e: { id: number, name: string }) => void }> = ({ wordList: list, onCollectionChange }) => {

    const [mylist, setList] = useState<Article[]>(list ?? []);
    const [importOpen, setImportOpen] = useState<boolean>(false);
    const [articleId, setArticleId] = useState<string>('');
    const [articleTitle, setArticleTitle] = useState<string>('');
    const [articleContent, setArticleContent] = useState<string>('');



    function fetchArticle(id: string) {
        return fetch("/hts/api/v1/material?id=" + id, {
            method: 'GEt',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response: Response) => {
            return response.json()
        }).then((data) => {
            setArticleId(data.article.id)
            setArticleTitle(data.article.title)
            setArticleContent(data.article.content)
        });
    }

    function revise(article: Article, proficiency: number) {
        fetch("/hts/api/v1/material/revise", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ material_id: article.id, proficiency: proficiency }),
        }).then((response: Response) => {
            return response.json()
        }).then((data) => {
            if (data.status == 'ok') {
                article.proficiency = proficiency
                setList((prevList) => {
                    return [...prevList];
                });
            }
        });
    }


    function deleteArticle(id: string) {

        fetch("/hts/api/v1/material?id=" + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response: Response) => {
            return response.json()
        }).then((data) => {

        });
    }

    useEffect(() => {
        setList(list)
    }, [list])

    return <>

        <div className="bg-[#101010] w-[600px]">
            <div className="mx-auto max-w-7xl min-w-[600px]">
                <div className="bg-white">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="mt-8 flow-root">
                            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                    <table className="min-w-full divide-y divide-gray-300">
                                        <thead>
                                            <tr>
                                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                                    Title
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Proficiency
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Actions
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Next Learn At
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {mylist?.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="whitespace-nowrap py-4 text-sm font-medium text-indigo-700 sm:pl-0 ">
                                                        <Link target="_blank" href={'/read/' + item.id} >
                                                            {item.title}
                                                        </Link>
                                                    </td>

                                                    <td className="whitespace-nowrap py-4 text-sm font-medium text-gray-700 sm:pl-0 text-center">
                                                        <LevelComponent updateLevel={(level) => {
                                                            revise(item, level)
                                                        }} currentLevel={item.proficiency} pages={[1, 2, 3, 4, 5]} />
                                                    </td>

                                                    <td className="flex justify-start relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                                        <Link target="_blank" href={'/practise/' + item.id} className="text-gray-700 mx-1" >
                                                            <RocketLaunchIcon className="cursor-pointer h-5 w-5 text-gray-900" />
                                                        </Link>

                                                        <PencilSquareIcon className="cursor-pointer h-5 w-5 text-gray-900 mx-1" onClick={() => {
                                                            fetchArticle(item.id).then(() => { setImportOpen(true) })

                                                            // TODO edit
                                                        }}> </PencilSquareIcon>

                                                        <TrashIcon className="cursor-pointer h-5 w-5 text-gray-900 mx-1" onClick={() => {
                                                            deleteArticle(item.id)
                                                            // TODO edit
                                                        }}> </TrashIcon>



                                                    </td>

                                                    <td className="whitespace-nowrap py-4 text-sm text-gray-600 sm:pl-0 text-center">
                                                        {item.updated_at.substring(0, 19)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <InputArticle open={importOpen} onClose={() => { setImportOpen(false) }} id={articleId} title={articleTitle} content={articleContent} />

    </>
};

export default ArticleList;