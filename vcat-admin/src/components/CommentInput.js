import React from "react";
import { Comment } from "semantic-ui-react";
import { dashboard, HomeCommentInsert } from "../libraries/dashboard";
import { CheckMessage } from "../common/Validation";
import User from "../modals/User";
import AppConfig from "../modals/AppConfig";

class CommentInput extends React.Component {
  state = {
    feeds: [],
    currentUser: [],
    reply: false,
    Comment: "",
    feed_id: "",
    commentStatus: false,
  };

  async componentDidMount() {
    if (this.props.password) {
      this.setState({ password: this.props.password });
    }
    const id = User.user_id;
    console.log("user is ---.", id);
    const response = await dashboard();
    const userinfo = response?.result?.userDetails[0];

    if (response && response?.status === "success") {
      this.setState({
        currentUser: userinfo,
      });
    }
  }

  render() {
    console.log("comment", this.state.Comment);
    const { currentUser } = this.state;
    return (
      <div className="comment-section-div">
        <Comment.Group>
          <form onSubmit={this.onSubmitComment} className="mb-4 t-l" autoComplete="off" autoSave="off">
            <div className="write-comment dflex mb-1">
              <Comment.Avatar
                src={currentUser.image}
                style={{ width: "3rem", height: "3rem" }}
                className="mr-2"
                alt="current-user"
              />
              <div className="text-area-main">
                <textarea
                  placeholder="your comment"
                  rows="2"
                  spellcheck="false"
                  value={this.state.Comment}
                  onChange={(e) =>
                    this.setState({
                      Comment: e.target.value,
                      commentStatus: true,
                    })
                  }
                />
              </div>
            </div>
            {this.state.Comment ? (
              <>
                <div className="mr-2"></div>
                <button className="no-style post-comment ml-5 mt-1">
                  Post
                </button>
              </>
            ) : null}
          </form>
        </Comment.Group>
      </div>
    );
  }

  validateComment = () => {
    const CommentError = CheckMessage(this.state.Comment);
    if (CommentError === 1) {
      this.setState({ CommentError: "Field empty" });
      return false;
    } else return true;
  };

  ValidateAll = () => {
    const Comment = this.validateComment();

    if (Comment) {
      return true;
    } else {
      return false;
    }
  };
  onSubmitComment = async (e) => {
    e.preventDefault();
    const allValidation = this.ValidateAll();
    if (allValidation) {
      const user_id = User.user_id;
      const requestData = {
        comment: this.state.Comment,
        feed_id: this.props.feedId,
        user_id: user_id,
      };
      const response = await HomeCommentInsert(requestData);
      if (response && response.status === "success") {
        this.setState({
          Comment: "",
        });
        window.location.reload();
        User.setRefresh(true);
      } else if (response.status === "error") {
        AppConfig.setMessage(response.result);
      }
    }
  };
}

export default CommentInput;
