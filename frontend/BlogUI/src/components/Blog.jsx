// frontend/src/components/Blog.js
import { useEffect, useState } from 'react';
import axios from 'axios';

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState({ title: '', author: '', content: '' });
    const [isEditing, setIsEditing] = useState(false);  // State to handle editing
    const [currentPostId, setCurrentPostId] = useState(null); // Store the post being edited

    // Fetch all blog posts from the backend
    const fetchPosts = async () => {
        const response = await axios.get('http://localhost:5000/api/posts');
        setPosts(response.data);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        setNewPost({ ...newPost, [e.target.name]: e.target.value });
    };

    // Submit a new post
    const createPost = async (e) => {
        e.preventDefault();
        if (isEditing) {
            await axios.put(`http://localhost:5000/api/posts/${currentPostId}`, newPost);
            setIsEditing(false);
            setCurrentPostId(null);
        } else {
            await axios.post('http://localhost:5000/api/posts', newPost);
        }
        setNewPost({ title: '', author: '', content: '' });
        fetchPosts(); // Refresh the posts
    };

    // Edit a post
    const editPost = (post) => {
        setNewPost(post);
        setIsEditing(true);
        setCurrentPostId(post._id);  // Save the ID of the post being edited
    };

    // Delete a post
    const deletePost = async (id) => {
        await axios.delete(`http://localhost:5000/api/posts/${id}`);
        fetchPosts(); // Refresh the posts
    };

    return (
        <div>
            <h1>Simple Blog</h1>

            <form onSubmit={createPost}>
                <input
                    type="text"
                    name="title"
                    value={newPost.title}
                    onChange={handleInputChange}
                    placeholder="Title"
                    required
                />
                <input
                    type="text"
                    name="author"
                    value={newPost.author}
                    onChange={handleInputChange}
                    placeholder="Author"
                    required
                />
                <textarea
                    name="content"
                    value={newPost.content}
                    onChange={handleInputChange}
                    placeholder="Content"
                    required
                ></textarea>
                <button type="submit">{isEditing ? 'Update Post' : 'Create Post'}</button>
            </form>

            <div className="posts-container">
                <h2>Blog Posts</h2>
                {posts.map((post) => (
                    <div key={post._id} className="post">
                        <h3>{post.title}</h3>
                        <p>{post.content}</p>
                        <small>Author: {post.author}</small>
                        <button onClick={() => editPost(post)}>Edit</button> {/* Edit button */}
                        <button className="delete" onClick={() => deletePost(post._id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Blog;
