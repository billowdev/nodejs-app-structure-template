import { IArticleAttributes } from "../interfaces/types/models/article.model.types";
import db from "../models";
import customError from "../utils/custom-error";
import articleErrors from "../errors/article.errors";
// import { delCache, getChache, setCache } from "../redis";
import { IArticleAuthorResponse, IArticleBodyResponse } from "../interfaces/types/handlers/article.handler.types";

export const createArticle = async (
  data: IArticleAttributes
): Promise<IArticleBodyResponse> => {
  const response: IArticleBodyResponse = await db.Article.create(data);
  return response;
};

// const getArticleCacheKey = "services:getArticleById";

export const fetchArticleById = async (
  id: string
): Promise<IArticleBodyResponse> => {

  // const articleCache: any | IArticleBodyResponse = await getChache(getArticleCacheKey);
  // if (articleCache) {
  //   return articleCache;
  // }
  const article: IArticleBodyResponse = await db.Article.findOne({
    where: { id },
  });

  if (article == null) {
    customError(articleErrors.ArticleGetFailure);
  }
  // setCache(getArticleCacheKey, article);
  return article;
};

export const updateArticle = async (
  id: string,
  title: string,
  text: string,
  type: string,
  UserId: string
): Promise<Number[]> => {
  const isValid = await db.Article.findOne({ where: { id } });
  if (isValid == null) {
    customError(articleErrors.ArticleInvalid);
  }
  const response: Number[] = await db.Article.update(
    { id, title, text, type, UserId },
    { where: { id } }
  ).catch((error: Error) => {
    customError(articleErrors.ArticleUpdateFailure);
  });
  // delete cache
  // delCache(getArticleCacheKey)
  return response;
};

export const deleteArticle = async (
  id: string,
  UserId: string
): Promise<number> => {
  const response: number = await db.Article.destroy({ where: { id, UserId } });
  return response;
};


export const fetchArticleByAuthor = async (
  UserId: string
): Promise<IArticleAuthorResponse> => {
  const response: IArticleAuthorResponse = await db.Article.findAll({ where: { UserId } });
  return response
}

export const fetchArticles = async (

): Promise<IArticleBodyResponse> => {
  const data = await db.Article.findAll()
  const response: IArticleBodyResponse = { data: data }
  return response
}

export default {
  createArticle,
  fetchArticleById,
  updateArticle,
  deleteArticle,
  fetchArticleByAuthor,
  fetchArticles
};
