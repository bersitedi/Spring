import React, { useEffect, useState } from "react";
import MainLayout from "../../components/MainLayout";
import BreadCrumbs from "../../components/BreadCrumbs";
import { Link, useParams } from "react-router-dom";
import SimilarPosts from "./container/SimilarPosts";
import { images, stables } from "../../constant";
import SocialShareButtons from "../../components/SocialShareButtons";
import { useQuery } from "@tanstack/react-query";
import { getAllPosts, getSinglePost } from "../../services/index/posts";
import ArticleDetailSkeleton from "./component/ArticleDetailSkeleton";
import ErrorMessage from "../../components/ErrorMessage";
import Editor from "../../components/editor/Editor";

const ArticleDetailPage = ({ post }) => {
  const { slug } = useParams();
  const [breadCrumbsData, setBreadCrumbsData] = useState([]);
  const [visibleSimilarPosts, setVisibleSimilarPosts] = useState([]);
  const [selectedPostIndex, setSelectedPostIndex] = useState(0);
  const [nextPostIndex, setNextPostIndex] = useState(0);
  const [body, setBody] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["project", slug],
    queryFn: () => getSinglePost({ slug }),
    onSuccess: (data) => {
      setBreadCrumbsData([
        { name: "Home", link: "/" },
        { name: "Project", link: "/projects" },
        { name: data.title, link: `/project/${data.slug}` },
      ]);
      setBody(data.body);
    },
  });
  const { data: postsData } = useQuery({
    queryFn: () => getAllPosts(),
    queryKey: ["posts"],
  });

  useEffect(() => {
    if (postsData) {
      setVisibleSimilarPosts(postsData.data.slice(0, 5));
    }
  }, [postsData]);

  const handleSelectPost = (index) => {
    const newPostIndex = (nextPostIndex + 1) % postsData.data.length;
    const newPost = postsData.data[newPostIndex];

    const updatedVisiblePosts = [...visibleSimilarPosts];
    const clickedPost = updatedVisiblePosts.splice(index, 1)[0];
    updatedVisiblePosts.push(clickedPost);

    updatedVisiblePosts[index] = newPost;

    setVisibleSimilarPosts(updatedVisiblePosts);
    setNextPostIndex(newPostIndex);
    setSelectedPostIndex(updatedVisiblePosts.length - 1);
  };

  return (
    <MainLayout>
      {isLoading ? (
        <ArticleDetailSkeleton />
      ) : isError ? (
        <ErrorMessage message="Something went wrong, Couldn't fetch the post detail" />
      ) : (
        <section className="container mx-auto max-w-5xl flex flex-col px-5 py-5 lg:flex-row lg:gap-x-5 lg:items-start">
          <article className="flex-1">
            <BreadCrumbs data={breadCrumbsData} />
            <img
              className="rounded-xl w-full"
              src={
                data?.photo
                  ? stables.S3_BUCKET_URL + data?.photo
                  : images.samplePostImage
              }
              alt={data?.title}
            />
            <div className="mt-4 flex gap-2">
              {data?.categories.map((category) => (
                <Link
                  to={`/project?category=${category.name}`}
                  className="text-primary text-sm font-roboto inline-block md:text-base"
                >
                  {category.name}
                </Link>
              ))}
            </div>

            <h1 className="text-xl font-semibold font-mono mt-4 text-dark-hard md:text-[26px]">
              {data?.title}
            </h1>
            <div className="w-full">
              {!isLoading && !isError && (
                <Editor content={data?.body} editable={false} />
              )}
            </div>
          </article>
          <div>
            <SimilarPosts
              header="Latest Article"
              posts={visibleSimilarPosts}
              tags={data?.tags}
              className="mt-8 lg:mt-0 lg:max-w-xs"
              selectedPostIndex={selectedPostIndex}
              onSelectPost={handleSelectPost}
            />
            <div className="mt-7">
              <h2 className="font-roboto font-medium text-dark-hard mb-4 md:text-xl">
                Share on:
              </h2>
              <SocialShareButtons
                url={encodeURI(window.location.href)}
                title={encodeURIComponent(data?.title)}
              />
            </div>
          </div>
        </section>
      )}
    </MainLayout>
  );
};

export default ArticleDetailPage;
