import React, { useState } from "react";
import CreatableSelect from "react-select/creatable";
import { Link, useParams, useNavigate } from "react-router-dom";
import ArticleDetailSkeleton from "../../../articleDetail/component/ArticleDetailSkeleton";
import ErrorMessage from "../../../../components/ErrorMessage";
import { stables } from "../../../../constant";
import { HiOutlineCamera } from "react-icons/hi";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import Editor from "../../../../components/editor/Editor";
import MultiSelectTagDropdown from "../../components/select-dropdown/MultiSelectTagDropdown";
import {
  categoryToOption,
  filterCategories,
} from "../../../../utils/multiSelectTagUtils";
import { FiArrowLeft } from "react-icons/fi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSingleNews, updateNews } from "../../../../services/index/news";
import { getAllNewsCategories } from "../../../../services/index/newsCategories";

const promiseOptions = async (inputValue) => {
  const { data: categoriesData } = await getAllNewsCategories();
  return filterCategories(inputValue, categoriesData);
};

const EditNews = () => {
  const { slug } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const userState = useSelector((state) => state.user);
  const [initialPhoto, setInitialPhoto] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [body, setBody] = useState(null);
  const [categories, setCategories] = useState(null);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState(null);
  const [newsSlug, setNewsSlug] = useState(slug);

  const { data, isLoading, isError } = useQuery({
    queryFn: () => getSingleNews({ slug }),
    queryKey: ["news", slug],
    onSuccess: (data) => {
      setInitialPhoto(data?.photo);
      setCategories(data.categories.map((item) => item._id));
      setTitle(data.title);
      setTags(data.tags);
    },
    refetchOnWindowFocus: false,
  });

  const {
    mutate: mutateUpdateNewsDetail,
    isLoading: isLoadingUpdateNewsDetail,
  } = useMutation({
    mutationFn: ({ updatedData, slug, token }) => {
      return updateNews({
        updatedData,
        slug,
        token,
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["news", slug]);
      toast.success("News is updated");
      navigate(`/admin/media/manage/edit/${data.slug}`, { replace: true });
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
  };

  const handleUpdateNews = async () => {
    let updatedData = {};

    // Append photo if it's updated or retained
    if (!initialPhoto && photo) {
      updatedData.image = photo;
    } else if (initialPhoto && !photo) {
      updatedData.image = stables.S3_BUCKET_URL + data?.photo;
    }

    updatedData.body = body;
    updatedData.categories = categories;
    updatedData.title = title;
    updatedData.tags = tags;
    updatedData.slug = newsSlug;

    try {
      const updatedNews = await updateNews({
        updatedData,
        slug,
        token: userState.userInfo.token,
      });

      queryClient.invalidateQueries(["news", slug]);
      toast.success("News is updated");
      navigate(`/admin/media/manage/edit/${updatedNews.slug}`, {
        replace: true,
      });
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const handleDeleteImage = () => {
    if (window.confirm("Do you want to delete your News picture?")) {
      setInitialPhoto(null);
      setPhoto(null);
    }
  };

  let isNewsDataLoaded = !isLoading && !isError;

  return (
    <div>
      <div className="flex items-center mb-4">
        <Link
          to="/admin/media/manage"
          className="text-gray-600 hover:text-gray-900 p-1 rounded-full text-2xl border border-green-400"
        >
          <FiArrowLeft className="mr-2 text-green-500 pl-1" />
        </Link>
      </div>
      {isLoading ? (
        <ArticleDetailSkeleton />
      ) : isError ? (
        <ErrorMessage message="Couldn't fetch the news detail" />
      ) : (
        <section className="container mx-auto max-w-5xl flex flex-col px-5 py-5 lg:flex-row lg:gap-x-5 lg:items-start">
          <article className="flex-1">
            <label htmlFor="newsPicture" className="w-full cursor-pointer">
              {photo ? (
                <img
                  src={URL.createObjectURL(photo)}
                  alt={data?.title}
                  className="rounded-xl w-full"
                />
              ) : initialPhoto ? (
                <img
                  src={stables.S3_BUCKET_URL + data?.photo}
                  alt={data?.title}
                  className="rounded-xl w-full"
                />
              ) : (
                <div className="w-full min-h-[200px] bg-blue-50/50 flex justify-center items-center">
                  <HiOutlineCamera className="w-7 h-auto text-primary" />
                </div>
              )}
            </label>
            <input
              type="file"
              className="sr-only"
              id="newsPicture"
              onChange={handleFileChange}
            />
            <button
              type="button"
              onClick={handleDeleteImage}
              className="w-fit bg-red-500 text-sm text-white font-semibold rounded-lg px-2 py-1 mt-5"
            >
              Delete Image
            </button>
            <div className="mt-4 flex gap-2">
              {data?.categories.map((category, index) => (
                <Link
                  key={index}
                  to={`/blog?category=${category.name}`}
                  className="text-primary text-sm font-roboto inline-block md:text-base"
                >
                  {category.name}
                </Link>
              ))}
            </div>
            <div className="d-form-control w-full">
              <label className="d-label" htmlFor="title">
                <span className="d-label-text">Title</span>
              </label>
              <input
                id="title"
                value={title}
                className="d-input d-input-bordered border-slate-300 !outline-slate-300 text-xl font-medium font-roboto text-dark-hard"
                onChange={(e) => setTitle(e.target.value)}
                placeholder="title"
              />
            </div>
            <div className="d-form-control w-full">
              <label className="d-label" htmlFor="slug">
                <span className="d-label-text">slug</span>
              </label>
              <input
                id="slug"
                value={newsSlug}
                className="d-input d-input-bordered border-slate-300 !outline-slate-300 text-xl font-medium font-roboto text-dark-hard"
                onChange={(e) =>
                  setNewsSlug(e.target.value.replace(/\s+/g, "-").toLowerCase())
                }
                placeholder="news slug"
              />
            </div>
            <div className="mb-5 mt-2">
              <label className="d-label">
                <span className="d-label-text">categories</span>
              </label>
              {isNewsDataLoaded && (
                <MultiSelectTagDropdown
                  loadOptions={promiseOptions}
                  defaultValue={data.categories.map(categoryToOption)}
                  onChange={(newValue) =>
                    setCategories(newValue.map((item) => item.value))
                  }
                />
              )}
            </div>
            <div className="mb-5 mt-2">
              <label className="d-label">
                <span className="d-label-text">tags</span>
              </label>
              {isNewsDataLoaded && (
                <CreatableSelect
                  defaultValue={data.tags.map((tag, index) => ({
                    value: tag,
                    label: tag,
                    key: index,
                  }))}
                  isMulti
                  onChange={(newValue) =>
                    setTags(newValue.map((item) => item.value))
                  }
                  className="relative z-20"
                />
              )}
            </div>
            <div className="w-full">
              {isNewsDataLoaded && (
                <Editor
                  content={data?.body}
                  editable={true}
                  onDataChange={(data) => {
                    setBody(data);
                  }}
                />
              )}
            </div>
            <button
              disabled={isLoadingUpdateNewsDetail}
              type="button"
              onClick={handleUpdateNews}
              className="w-full bg-green text-white font-semibold rounded-lg px-4 py-2 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Update News
            </button>
          </article>
        </section>
      )}
    </div>
  );
};

export default EditNews;
