import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js"
import { User } from "../models/user.model.js"

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { textMessage: message } = req.body;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        })
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            })
        }
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        })
        if (newMessage) conversation.messages.push(newMessage._id);
        await Promise.all([conversation.save(), newMessage.save()])

        return res.status(201).json({
            success: true,
            newMessage
        })
    } catch (error) {
        console.log(error);
    }
}

export const getMessages = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate('messages');
        if (!conversation) return res.status(200).json({ success: true, messages: [] });
        return res.status(200).json({ success: true, messages: conversation?.messages });

    } catch (error) {
        console.log(error);
    }
}

export const deleteMessage = async (req, res) => {
    try {
        const userId = req.id;
        const messageId = req.params.id;
        
        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({
                message: "Message not found",
                success: false
            });
        }

        if (message.senderId.toString() !== userId) {
            return res.status(403).json({
                message: "You can only delete your own messages",
                success: false
            });
        }

        const deletedmessage = await Message.findById(messageId)
        deletedmessage.message="",
        deletedmessage.isDeleted=true,
        await deletedmessage.save()
        // await Promise.all([
        //     Message.findByIdAndDelete(messageId),
        //     Conversation.updateOne(
        //         { messages: messageId },
        //         { $pull: { messages: messageId }}
        //     )
        // ]);

        return res.status(200).json({
            message: "Message deleted",
            success: true
            
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
}

export const deleteConversation = async(req,res)=>{
    try {
        const userId = req.id;
        const targetUser = req.params.id;
        let conversation = await Conversation.findOne({
            participants:{$all:[userId,targetUser]}
        })
        if(!conversation){
            return res.status(404).json({
                message:'conversation not found',
                success:false
            })
        }
        await Promise.all([
            Conversation.findByIdAndDelete(conversation._id.toString()),
            Message.deleteMany({
                $or: [
                    { senderID: userId, receiverID: targetUser },
                    { senderID: targetUser, receiverID: userId }
                ]
            })
            
        ])
        return res.status(200).json({
            message:'Conversation deleted successfully',
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}
