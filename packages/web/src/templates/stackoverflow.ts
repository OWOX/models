import type { ModelGraph } from "@mc/okf";
import { f, mart, rel, type Template } from "./helpers";

const graph: ModelGraph = {
  storageId: null,
  nodes: [
    mart("users", "Users", "TABLE", [
      f("id", "INTEGER", true, "Unique identifier of the user."),
      f("display_name", "STRING", false, "Public display name of the user."),
      f("reputation", "INTEGER", false, "Reputation points earned from community activity."),
      f("creation_date", "TIMESTAMP", false, "Timestamp when the user account was created."),
      f("location", "STRING", false, "Free-text location provided by the user."),
      f("up_votes", "INTEGER", false, "Number of up votes cast by the user."),
      f("down_votes", "INTEGER", false, "Number of down votes cast by the user."),
    ], "Stack Overflow users: one row per registered user with reputation and vote counts."),
    mart("posts_questions", "Posts Questions", "TABLE", [
      f("id", "INTEGER", true, "Unique identifier of the question post."),
      f("title", "STRING", false, "Title text of the question."),
      f("body", "STRING", false, "HTML body content of the question."),
      f("owner_user_id", "INTEGER", false, "User id of the question's author."),
      f("creation_date", "TIMESTAMP", false, "Timestamp when the question was posted."),
      f("score", "INTEGER", false, "Net score (up votes minus down votes) of the question."),
      f("view_count", "INTEGER", false, "Number of times the question has been viewed."),
      f("answer_count", "INTEGER", false, "Number of answers posted to the question."),
      f("tags", "STRING", false, "Tags associated with the question, separated by pipes."),
    ], "Stack Overflow questions: one row per question post."),
    mart("posts_answers", "Posts Answers", "TABLE", [
      f("id", "INTEGER", true, "Unique identifier of the answer post."),
      f("parent_id", "INTEGER", false, "Id of the question this answer responds to."),
      f("owner_user_id", "INTEGER", false, "User id of the answer's author."),
      f("body", "STRING", false, "HTML body content of the answer."),
      f("creation_date", "TIMESTAMP", false, "Timestamp when the answer was posted."),
      f("score", "INTEGER", false, "Net score (up votes minus down votes) of the answer."),
    ], "Stack Overflow answers: one row per answer post linked to a question."),
    mart("comments", "Comments", "TABLE", [
      f("id", "INTEGER", true, "Unique identifier of the comment."),
      f("post_id", "INTEGER", false, "Id of the post the comment was made on."),
      f("user_id", "INTEGER", false, "User id of the comment's author."),
      f("text", "STRING", false, "Text content of the comment."),
      f("creation_date", "TIMESTAMP", false, "Timestamp when the comment was posted."),
      f("score", "INTEGER", false, "Number of up votes the comment received."),
    ], "Stack Overflow comments: one row per comment on a question or answer."),
    mart("votes", "Votes", "TABLE", [
      f("id", "INTEGER", true, "Unique identifier of the vote."),
      f("post_id", "INTEGER", false, "Id of the post the vote applies to."),
      f("vote_type_id", "INTEGER", false, "Code identifying the type of vote cast."),
      f("creation_date", "TIMESTAMP", false, "Timestamp when the vote was cast."),
    ], "Stack Overflow votes: one row per vote cast on a post."),
    mart("badges", "Badges", "TABLE", [
      f("id", "INTEGER", true, "Unique identifier of the badge award."),
      f("user_id", "INTEGER", false, "User id who earned the badge."),
      f("name", "STRING", false, "Name of the badge."),
      f("date", "TIMESTAMP", false, "Timestamp when the badge was awarded."),
      f("class", "INTEGER", false, "Badge class: gold (1), silver (2), or bronze (3)."),
    ], "Stack Overflow badges: one row per badge awarded to a user."),
    mart("tags", "Tags", "TABLE", [
      f("id", "INTEGER", true, "Unique identifier of the tag."),
      f("tag_name", "STRING", false, "Name of the tag."),
      f("count", "INTEGER", false, "Number of questions associated with the tag."),
      f("excerpt_post_id", "INTEGER", false, "Id of the post holding the tag's excerpt text."),
    ], "Stack Overflow tags: one row per tag with usage count."),
  ],
  edges: [
    rel("e1", "posts_questions", "users", "owner_user_id", "id"),
    rel("e2", "posts_answers", "posts_questions", "parent_id", "id"),
    rel("e3", "posts_answers", "users", "owner_user_id", "id"),
    rel("e4", "comments", "posts_questions", "post_id", "id"),
    rel("e5", "comments", "users", "user_id", "id"),
    rel("e6", "votes", "posts_questions", "post_id", "id"),
    rel("e7", "badges", "users", "user_id", "id"),
  ],
};

export const stackoverflow: Template = {
  id: "stackoverflow",
  nicheId: null,
  category: "dataset",
  name: "Stack Overflow",
  description: "Users, questions, answers, comments, votes, badges and tags from the public Stack Overflow BigQuery dataset.",
  graph,
};
