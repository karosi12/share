import Post from '../model/post';
import logger from '../utils/logger';
import Responses from "../helper/responses";

const create = async (req, res) => {
  try {
    const {id} = req.decoded
    if(!req.body.post) return res.status(400).send(400, 'post is required')
    const post = await Post.create({ post: req.body.post, userId: id })
    if(!post) return res.status(400).send(Responses.error(400, "unable to create post"));
    return res.status(201).send(Responses.success(201, "post created successfully", post));
  } catch (error) {
    logger.info(`Internal server error => ${error}`)
    return res.status(500).send(Responses.error(500, "Internal server error"));
  }
}

const view = async (req, res) => {
  try {
    const {id} = req.params
    const post = await Post.findById(id)
    if(!post) return res.status(400).send(Responses.error('post not found'))
    return res.status(200).send(Responses.success(200, 'post retrieved successfully', post));
  } catch (error) {
    logger.info(`Internal server error => ${error}`)
    return res.status(500).send(Responses.error(500, "Internal server error"));
  }
}

const list = async (req, res) => {
  try {
    const { q } = req.query;
    const search = q === undefined ? {}: { $text: { $search: `\"${q}\"` } };
    const criteria =  Object.assign({}, search);
    const post = await Post.find(criteria)
    if(!post) return res.status(400).send(Responses.error(400, 'post not found'))
    if(post.length === 0) return res.status(200).send(Responses.success(200, 'Record not found', post))
    return res.status(200).send(Responses.success(200, 'Record retrieved', post));
  } catch (error) {
    logger.info(`Internal server error => ${error}`)
    return res.status(500).send(Responses.error(500, "Internal server error"));
  }
}

const upVote = async (req, res) => {
  try {
    const {id} = req.params
    const post = await Post.findOne({_id: id})
    post.upvote += 1
    await post.save()
    return res.status(200).send(Responses.success(200, 'upvoted', post));
  } catch (error) {
    logger.info(`Internal server error => ${error}`)
    return res.status(500).send(Responses.error(500, "Internal server error"));
  }
}
const downVote = async (req, res) => {
  try {
    const {id} = req.params
    const post = await Post.findOne({_id: id})
    post.downvote += 1
    await post.save()
    return res.status(200).send(Responses.success(200, 'downvoted', post));
  } catch (error) {
    logger.info(`Internal server error => ${error}`)
    return res.status(500).send(Responses.error(500, "Internal server error"));
  }
}

const comment = async (req, res) => {
  try {
    const {id} = req.decoded
    const {comment, postId} = req.body
    const post = await Post.findOne({_id: postId})
    post.comments.push({userId: id, comment})
    await post.save()
    return res.status(200).send(Responses.success(200, 'user comment was successful', post));
  } catch (error) {
    logger.info(`Internal server error => ${error}`)
    return res.status(500).send(Responses.error(500, "Internal server error"));
  }
}

const subscribe = async (req, res) => {
  try {
    const { id } = req.decoded
    const { postId } = req.body
    const post = await Post.findOne({_id: postId})
    post.subscribe.push(id)
    await post.save()
    return res.status(200).send(Responses.success(200, 'user subscribed to this post', post));
  } catch (error) {
    logger.info(`Internal server error => ${error}`)
    return res.status(500).send(Responses.error(500, "Internal server error"));
  }
}

export default { create, view, list, upVote, downVote, subscribe, comment }